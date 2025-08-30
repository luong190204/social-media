package com.social.socialmedia.service;

import com.social.socialmedia.configuration.SecurityUtils;
import com.social.socialmedia.dto.request.CommentRequest;
import com.social.socialmedia.dto.request.CommentUpdateRequest;
import com.social.socialmedia.dto.request.PostCreateRequest;
import com.social.socialmedia.dto.request.PostUpdateRequest;
import com.social.socialmedia.dto.response.CommentResponse;
import com.social.socialmedia.dto.response.PostLikeResponse;
import com.social.socialmedia.dto.response.PostResponse;
import com.social.socialmedia.dto.response.UserResponse;
import com.social.socialmedia.entity.Comment;
import com.social.socialmedia.entity.Post;
import com.social.socialmedia.entity.PostLike;
import com.social.socialmedia.entity.User;
import com.social.socialmedia.enums.CommentStatus;
import com.social.socialmedia.enums.PostStatus;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.mapper.CommentMapper;
import com.social.socialmedia.mapper.PostMapper;
import com.social.socialmedia.repository.CommentPostRepository;
import com.social.socialmedia.repository.PostLikeRepository;
import com.social.socialmedia.repository.PostRepository;
import com.social.socialmedia.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.security.SecurityUtil;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private CommentPostRepository commentPostRepository;

    @Autowired
    private CommentMapper commentMapper;

    public PostResponse createPost(PostCreateRequest request, MultipartFile file) {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Post post = postMapper.toPost(request);

        post.setAuthorId(user.getId());
        post.setStatus(request.getStatus() != null ? request.getStatus() : PostStatus.ACTIVE);

        // Upload ảnh
        if (file != null && !file.isEmpty()) {
            String imgUrl = cloudinaryService.uploadFile(file);

            if (post.getMediaUrls() == null) {
                post.setMediaUrls(new ArrayList<>());
            }

            post.getMediaUrls().add(imgUrl);
        }


        return postMapper.toPostResponse(postRepository.save(post));
    }

    public List<PostResponse> getAllPost() {
        return postRepository.findAll().stream()
                .map(postMapper::toPostResponse).toList();
    }

    // Lấy tất cả posts của 1 user
    public List<PostResponse> getAllPostByUser() {
        String currentUserId = SecurityUtils.getCurrentUserId();

        return postRepository.findByAuthorId(currentUserId).stream()
                .map(post -> {
                    PostResponse response = postMapper.toPostResponse(post);
                    User user = userRepository.findById(post.getAuthorId()).
                            orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
                    response.setAuthor(UserResponse.builder()
                                    .id(user.getId())
                                    .username(user.getUsername())
                                    .profilePic(user.getProfilePic())
                            .build());
                    return response;
                }).toList();
    }

    @PreAuthorize("@postSecurity.isAuthor(#postId, authentication)")
    public PostResponse updatePost(String postId, PostUpdateRequest request) {
        Post post = postRepository.findById(postId).orElseThrow(
                () -> new AppException(ErrorCode.POST_NOT_FOUND));

        postMapper.updatePost(post, request);
        return postMapper.toPostResponse(postRepository.save(post));
    }

    @PreAuthorize("@postSecurity.isAuthor(#postId, authentication)")
    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }

    // Like post
    public PostLikeResponse toggleLike(String postId) {
        // Lấy ra username từ jwt -> để lấy id
        var username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Check xem đã like chưa
        boolean alreadyLiked = postLikeRepository.existsByPostIdAndUserId(postId, user.getId());

        if (alreadyLiked) {
            postLikeRepository.deleteByPostIdAndUserId(postId, user.getId());
        } else {
            PostLike postLike = PostLike.builder()
                    .postId(postId)
                    .userId(user.getId())
                    .build();
            postLikeRepository.save(postLike);
        }

        // Count like
        int totalLikes = postLikeRepository.countByPostId(postId);

        return PostLikeResponse.builder()
                .postId(postId)
                .totalLikes(totalLikes)
                .likeByMe(!alreadyLiked)
                .build();
    }

    // Comment
    public CommentResponse commentPost(String postId, CommentRequest request) {
        // Lấy ra username từ jwt -> để lấy id
        var username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        // Map request -> entity
        Comment comment = commentMapper.toComment(request);

        comment.setUserId(user.getId());
        comment.setPostId(postId);
        comment.setStatus(CommentStatus.ACTIVE);

        // Map sang response
        CommentResponse response = commentMapper.toCommentResponse(commentPostRepository.save(comment));
        response.setAuthorName(user.getUsername());

        return response;
    }

    // Get Comments
    public Page<CommentResponse> getCommentByPost(String postId, int page, int size, String sort) {

        // kiểm tra post tôn tại k
        if (!postRepository.existsById(postId)) throw new AppException(ErrorCode.POST_NOT_FOUND);

        // Xử lý sắp xếp
        Sort sortOder = parseSort(sort);
        Pageable pageable = PageRequest.of(page, size, sortOder);

        // Lấy bình luận cha và tt người dùng
        Page<Comment> parentPage = commentPostRepository.findByPostIdAndParentId(postId, null, pageable);

        // Convert sang DTO + gắn thông tin user
        return parentPage.map(this::toDtoResponse);
    }

    // Get replies của 1 comment
    public Page<CommentResponse> getRepliesByComment(String parentCommentId, int page, int size, String sort) {

        Sort sortOrder = parseSort(sort);
        Pageable pageable =  PageRequest.of(page, size, sortOrder);

        Page<Comment> replies = commentPostRepository.findByParentId(parentCommentId, pageable);

        return replies.map(this::toDtoResponse);
    }

    private CommentResponse toDtoResponse(Comment comment) {
        CommentResponse response = commentMapper.toCommentResponse(comment);

        User author = userRepository.findById(response.getUserId()).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        response.setAuthorName(author.getUsername());
        response.setAuthorAvatar(author.getProfilePic());

        return response;
    }

    // Helper parse sort param createdAt
    private Sort parseSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Order.desc("createdAt"));
        }

        String[] parts = sort.split(",");
        String field = parts[0]; // Lấy createdAt
        Sort.Direction direction = (parts.length > 1 && parts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return Sort.by(new Sort.Order(direction, field));
    }

    @PreAuthorize("@commentSecurity.isAuthor(#commentId, authentication)")
    public CommentResponse updateComment(String commentId, CommentUpdateRequest request) {

        // Lấy ra comment
        Comment comment = (commentPostRepository.findById(commentId).orElseThrow(
                () -> new AppException(ErrorCode.COMMENT_NOT_FOUND)));

        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());

        commentPostRepository.save(comment);
        return commentMapper.toCommentResponse(comment);
    }

    @Transactional
    @PreAuthorize("@commentSecurity.isAuthorOrAdmin(#commentId, authentication)")
    public void deleteComment (String commentId) {
        // xóa comment con
        commentPostRepository.deleteByParentId(commentId);

        // xóa comment cha
        commentPostRepository.deleteById(commentId);
    }
}









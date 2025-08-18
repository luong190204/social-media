package com.social.socialmedia.service;

import com.social.socialmedia.dto.request.CommentRequest;
import com.social.socialmedia.dto.request.PostCreateRequest;
import com.social.socialmedia.dto.request.PostUpdateRequest;
import com.social.socialmedia.dto.response.CommentResponse;
import com.social.socialmedia.dto.response.PostLikeResponse;
import com.social.socialmedia.dto.response.PostResponse;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.List;

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

    @PostAuthorize("returnObject.authorId == authentication.token.claims['id']")
    public PostResponse getPost(String postId) {
        return postMapper.toPostResponse(postRepository.findById(postId).orElseThrow(
                () -> new AppException(ErrorCode.POST_FOUND)));
    }

    @PreAuthorize("@postSecurity.isAuthor(#postId, authentication)")
    public PostResponse updatePost(String postId, PostUpdateRequest request) {
        Post post = postRepository.findById(postId).orElseThrow(
                () -> new AppException(ErrorCode.POST_FOUND));

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

        postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.POST_FOUND));

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

    public List<CommentResponse> getCommentsByPost(String postId, int page, int size) {
        Pageable pageable = (Pageable) PageRequest.of(page, size);

        // Lấy comment cha
        List<Comment> parentComments = commentPostRepository.findByPostIdAndParentId(postId, null, pageable);

        // Map sang dto
        List<CommentResponse> responses = parentComments.stream().map(comment -> {
            CommentResponse response = commentMapper.toCommentResponse(comment);

            User user = userRepository.findById(comment.getId()).orElseThrow(
                    () -> new AppException(ErrorCode.USER_NOT_EXISTED));

            response.setAuthorName(user.getUsername());

            // Lấy reply
            List<Comment> replies = commentPostRepository.findByParentId(comment.getId());
            List<CommentResponse> replyResponses = replies.stream().map(reply -> {
                CommentResponse r = commentMapper.toCommentResponse(reply);
                User replyUser = userRepository.findById(reply.getId()).orElseThrow(
                        () -> new AppException(ErrorCode.USER_NOT_EXISTED));

                r.setAuthorName(replyUser.getUsername());
                return r;
            }).toList();

            response.setReplies(replyResponses);
            return response;
        }).toList();

        return responses;
    }
}









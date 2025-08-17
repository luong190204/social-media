package com.social.socialmedia.service;

import com.social.socialmedia.dto.request.PostCreateRequest;
import com.social.socialmedia.dto.request.PostUpdateRequest;
import com.social.socialmedia.dto.response.PostResponse;
import com.social.socialmedia.entity.Post;
import com.social.socialmedia.entity.User;
import com.social.socialmedia.enums.PostStatus;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.mapper.PostMapper;
import com.social.socialmedia.repository.PostRepository;
import com.social.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
}

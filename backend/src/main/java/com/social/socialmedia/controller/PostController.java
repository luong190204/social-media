package com.social.socialmedia.controller;

import com.social.socialmedia.dto.request.*;
import com.social.socialmedia.dto.response.CommentResponse;
import com.social.socialmedia.dto.response.PostLikeResponse;
import com.social.socialmedia.dto.response.PostResponse;
import com.social.socialmedia.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ApiResponse<PostResponse> createPost(@Valid @RequestPart("request") PostCreateRequest request,
                                                @RequestPart(value = "files", required = false) MultipartFile[] file) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.createPost(request, file))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PostResponse>> getAllPost() {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getAllPost())
                .build();
    }

    @GetMapping("/user")
    public ApiResponse<List<PostResponse>> getAllPostByUser() {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getAllPostByUser())
                .build();
    }

    @PutMapping("/{postId}")
    public ApiResponse<PostResponse> updatePost(@PathVariable String postId, @Valid
                                                @RequestBody PostUpdateRequest request) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.updatePost(postId, request))
                .build();
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<String> deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
        return ApiResponse.<String>builder()
                .result("Post has been deleted")
                .build();
    }

    @PostMapping("/{postId}/like")
    public ApiResponse<PostLikeResponse> toggleLike(@PathVariable String postId) {
        return ApiResponse.<PostLikeResponse>builder()
                .result(postService.toggleLike(postId))
                .build();
    }

    @PostMapping("/{postId}/comment")
    public ApiResponse<CommentResponse> comment(@PathVariable String postId, @RequestBody CommentRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(postService.commentPost(postId, request))
                .build();
    }

    @GetMapping("/{postId}/comments")
    public ApiResponse<Page<CommentResponse>> getCommentsByPost(
            @PathVariable String postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        Page<CommentResponse> comments = postService.getCommentByPost(postId, page, size, sort);

        return ApiResponse.<Page<CommentResponse>>builder()
                .result(comments)
                .build();
    }

    @GetMapping("/comments/{commentId}/replies")
    public ApiResponse<Page<CommentResponse>> getRepliesByComment(
            @PathVariable String commentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        Page<CommentResponse> replies = postService.getRepliesByComment(commentId, page, size, sort);

        return ApiResponse.<Page<CommentResponse>>builder()
                .result(replies)
                .build();
    }

    @PutMapping("/comments/{commentId}")
    public ApiResponse<CommentResponse> updateComment(@PathVariable String commentId,
                                                      @RequestBody CommentUpdateRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(postService.updateComment(commentId, request))
                .build();
    }

    @DeleteMapping("comments/{commentId}")
    public ApiResponse<String> deleteComment(@PathVariable String commentId) {
        postService.deleteComment(commentId);
        return ApiResponse.<String>builder()
                .result("Comment has been deleted")
                .build();
    }

}

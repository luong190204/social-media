package com.social.socialmedia.controller;

import com.social.socialmedia.dto.request.ApiResponse;
import com.social.socialmedia.dto.request.PostCreateRequest;
import com.social.socialmedia.dto.request.PostUpdateRequest;
import com.social.socialmedia.dto.response.PostResponse;
import com.social.socialmedia.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ApiResponse<PostResponse> createPost(@Valid @RequestBody PostCreateRequest request,
                                                @RequestPart(value = "file", required = false) MultipartFile file) {
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

    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> getPost(@PathVariable String postId) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.getPost(postId))
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
}

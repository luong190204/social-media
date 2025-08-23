package com.social.socialmedia.controller;

import com.social.socialmedia.dto.request.ApiResponse;
import com.social.socialmedia.dto.response.FollowResponse;
import com.social.socialmedia.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/follow/{targetId}")
    public ApiResponse<Void> follow(@PathVariable String targetId) {
        followService.follow(targetId);
        return ApiResponse.<Void>builder()
                .message("Followed successfully")
                .build();
    }

    @DeleteMapping("unfollow/{targetId}")
    public ApiResponse<Void> unfollow(@PathVariable String targetId) {
        followService.unfollow(targetId);
        return ApiResponse.<Void>builder()
                .message("Unfollowed successfully")
                .build();
    }

    @GetMapping("/followers")
    public ApiResponse<List<FollowResponse>>getMyFollowers() {
        return ApiResponse.<List<FollowResponse>>builder()
                .result(followService.getMyFollower())
                .build();
    }

    @GetMapping("/following")
    public ApiResponse<List<FollowResponse>> getMyFollowing() {
        return ApiResponse.<List<FollowResponse>>builder()
                .result(followService.getMyFollowing())
                .build();
    }

    @GetMapping("/{userId}/followers")
    public ApiResponse<List<FollowResponse>> getFollowers(@PathVariable String userId) {
        return ApiResponse.<List<FollowResponse>>builder()
                .result(followService.getFollowers(userId))
                .build();
    }

    @GetMapping("/{userId}/following")
    public ApiResponse<List<FollowResponse>> getFollowing(@PathVariable String userId) {
        return ApiResponse.<List<FollowResponse>>builder()
                .result(followService.getFollowing(userId))
                .build();
    }

}

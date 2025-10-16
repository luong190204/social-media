package com.social.socialmedia.controller;

import com.social.socialmedia.dto.request.ApiResponse;
import com.social.socialmedia.dto.response.PostResponse;
import com.social.socialmedia.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    @Autowired
    private FeedService feedService;

    @GetMapping
    public ApiResponse<Page<PostResponse>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<PostResponse>>builder()
                .result(feedService.getFeed(page, size))
                .build();
    }

}

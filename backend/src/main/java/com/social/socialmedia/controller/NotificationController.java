package com.social.socialmedia.controller;

import com.social.socialmedia.configuration.SecurityUtils;
import com.social.socialmedia.dto.request.ApiResponse;
import com.social.socialmedia.dto.response.NotificationResponse;
import com.social.socialmedia.entity.Notification;
import com.social.socialmedia.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ApiResponse<Page<NotificationResponse>> getUserNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<NotificationResponse>>builder()
                .result(notificationService.getUserNotifications(page, size))
                .build();
    }

    @PostMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);

        return ApiResponse.<Void>builder()
                .message("Đánh dấu đã đọc thành công")
                .build();
    }

    @PostMapping("/read-all")
    public ApiResponse<Void> markAllAsRead() {
        String userId = SecurityUtils.getCurrentUserId();

        notificationService.markAllAsRead(userId);
        return ApiResponse.<Void>builder()
                .message("Đánh dấu tất cả thành công")
                .build();
    }
}

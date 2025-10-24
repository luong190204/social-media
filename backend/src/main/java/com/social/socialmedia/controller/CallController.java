package com.social.socialmedia.controller;

import com.social.socialmedia.dto.request.ApiResponse;
import com.social.socialmedia.entity.CallRecord;
import com.social.socialmedia.service.CallService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calls")
@RequiredArgsConstructor
public class CallController {
    private final CallService callService;

    // Lấy lịch sử của 1 user
    @GetMapping("/history/{userId}")
    public ApiResponse<List<CallRecord>> getCallHistory(@PathVariable String userId) {
        return ApiResponse.<List<CallRecord>>builder()
                .result(callService.getHistory(userId))
                .build();
    }

    // Lấy chi tiết 1 cuộc gọi
    @GetMapping("/{callId}")
    public ApiResponse<CallRecord> getCallById(@PathVariable String callId) {
        return ApiResponse.<CallRecord>builder()
                .result(callService.getByCallId(callId))
                .build();
    }

    // Đánh dấu missed (nếu frontend timeout)
    @PostMapping("/{callId}/missed")
    public ApiResponse<Void> markMissed(@PathVariable String callId) {
        callService.markMissed(callId);
        return ApiResponse.<Void>builder()
                .message("Không nhận được phản hồi")
                .build();
    }

    // Kết thúc cuộc gọi
    @PostMapping("/{callId}/end")
    public ApiResponse<Void> markEnded(@PathVariable String callId) {
        callService.markEnd(callId);
        return ApiResponse.<Void>builder()
                .message("Kết thúc cuộc gọi")
                .build();
    }
}

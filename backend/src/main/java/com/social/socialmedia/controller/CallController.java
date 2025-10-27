package com.social.socialmedia.controller;

import com.social.socialmedia.dto.request.ApiResponse;
import com.social.socialmedia.dto.response.CallHistoryResponse;
import com.social.socialmedia.entity.Call;
import com.social.socialmedia.entity.User;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.repository.UserRepository;
import com.social.socialmedia.service.CallService;
import com.social.socialmedia.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/calls")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CallController {
    private final CallService callService;
    private final UserService userService;
    private final UserRepository userRepository;

    // Lấy lịch sử cuộc gọi với phân trang
    @GetMapping("/history")
    public ApiResponse<Page<CallHistoryResponse>> getCallHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String userId = userDetails.getUsername();
        log.info("Fetching call history for user: {}", userId);

        Pageable pageable = PageRequest.of(page, size);
        Page<Call> calls = callService.getCallHistory(userId, pageable);

        Page<CallHistoryResponse> response = calls.map(call ->
                mapToHistoryResponse(call, userId)
        );

        return ApiResponse.<Page<CallHistoryResponse>>builder()
                .result(response)
                .build();
    }

    // Lấy danh sách cuộc gọi nhỡ
    @GetMapping("/missed")
    public ApiResponse<List<CallHistoryResponse>> getMissedCalls(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        log.info("Fetching missed calls for user: {}", userId);

        List<Call> missedCalls = callService.getMissedCalls(userId);
        List<CallHistoryResponse> response = missedCalls.stream()
                .map(call -> mapToHistoryResponse(call, userId))
                .collect(Collectors.toList());

        return ApiResponse.<List<CallHistoryResponse>>builder()
                .result(response)
                .build();
    }

    // Đếm số cuộc gọi nhỡ
    @GetMapping("/missed/count")
    public ApiResponse<Map<String, Long>> getMissedCallsCount(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        long count = callService.countMissedCalls(userId);

        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ApiResponse.<Map<String, Long>>builder()
                .result(response)
                .build();
    }

    // Kiểm tra cuộc gọi đang diễn ra
//    @GetMapping("/active")
//    public ApiResponse<List<Call>> getActiveCall(@AuthenticationPrincipal UserDetails userDetails) {
//        String userId = userDetails.getUsername();
//
//        return ApiResponse.<List<Call>>builder()
//                .result(callService.getActiveCall(userId).stream().toList())
//                .build();
//    }

    private CallHistoryResponse mapToHistoryResponse(Call call, String currentUserId) {
        boolean isIncoming = call.getCalleeId().equals(currentUserId);
        String otherUserId = isIncoming ? call.getCallerId() : call.getCalleeId();

        User otherUser = userRepository.findById(otherUserId).orElseThrow(
                () -> new AppException(ErrorCode.USER_FOUND));

        return CallHistoryResponse.builder()
                .callId(call.getId())
                .callerId(call.getCallerId())
                .callerName(isIncoming ? otherUser.getFullName() : "You")
                .callerAvatar(isIncoming ? otherUser.getProfilePic() : null)
                .calleeId(call.getCalleeId())
                .calleeName(!isIncoming ? otherUser.getFullName() : "You")
                .calleeAvatar(!isIncoming ? otherUser.getProfilePic() : null)
                .type(call.getType())
                .status(call.getStatus())
                .createdAt(call.getCreatedAt())
                .durationSeconds(call.getDuration())
                .isIncoming(isIncoming)
                .build();
    }
}

package com.social.socialmedia.controller;

import com.social.socialmedia.dto.request.ApiResponse;
import com.social.socialmedia.dto.response.ConversationResponse;
import com.social.socialmedia.dto.response.UserResponse;
import com.social.socialmedia.entity.Conversation;
import com.social.socialmedia.service.ConversationService;
import com.social.socialmedia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ApiResponse<Conversation> createConversation(@RequestBody Map<String, List<String>> request) {
        return ApiResponse.<Conversation>builder()
                .result(conversationService.createConversation(request.get("participantIds")))
                .build();
    }

    // Lấy ra để hiện thị lên sidebar
    @GetMapping("/raw")
    public ApiResponse<List<Conversation>> getConversation() {
        return ApiResponse.<List<Conversation>>builder()
                .result(conversationService.getUsersConversations())
                .build();
    }

    @GetMapping
    public ApiResponse<List<ConversationResponse>> getConversationsForSidebar() {
        return ApiResponse.<List<ConversationResponse>>builder()
                .result(conversationService.getConversationsListForSidebar())
                .build();
    }

    // Api cập nhật count TN đã đọc
    @PutMapping("/{conversationId}/read")
    public ApiResponse<Void> markConversationAsRead(@PathVariable String conversationId) {
        conversationService.markConversationAsRead(conversationId);

        return ApiResponse.<Void>builder()
                .message("Marked as read")
                .build();
    }

    // Search người dùng trong message
    @GetMapping("/search")
    public ApiResponse<List<UserResponse>> searchUsers(@RequestParam("q") String query) {
        List<UserResponse> partners = userService.searchUsersMessage(query);
        return ApiResponse.<List<UserResponse>>builder()
                .result(partners)
                .build();
    }

}

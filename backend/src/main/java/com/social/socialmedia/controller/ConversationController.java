package com.social.socialmedia.controller;

import com.social.socialmedia.dto.request.ApiResponse;
import com.social.socialmedia.dto.response.ConversationResponse;
import com.social.socialmedia.entity.Conversation;
import com.social.socialmedia.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

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

}

package com.social.socialmedia.controller;

import com.social.socialmedia.dto.request.ApiResponse;
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

    @GetMapping
    public ApiResponse<List<Conversation>> getConversation() {
        return ApiResponse.<List<Conversation>>builder()
                .result(conversationService.getUsersConversations())
                .build();
    }

}

package com.social.socialmedia.controller;

import com.social.socialmedia.dto.request.ApiResponse;
import com.social.socialmedia.dto.request.MessageRequest;
import com.social.socialmedia.entity.Message;
import com.social.socialmedia.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/text")
    public ApiResponse<Message> sendTextMessage(@RequestBody MessageRequest request) {
        return ApiResponse.<Message>builder()
                .result(messageService.sendTextMessage(request))
                .build();
    }

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Message> sendImageMessage(
            @RequestParam("conversationId") String conversationId,
            @RequestParam("senderId") String senderId,
            @RequestParam("image") MultipartFile image
    ) {
        return ApiResponse.<Message>builder()
                .result(messageService.senImageMessage(conversationId, senderId, image))
                .build();
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ApiResponse<Page<Message>> getMessages(
            @PathVariable String conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size
    ) {
        var getMessage = messageService.getMessages(conversationId, PageRequest
                .of(page, size, Sort.by("timestamp").ascending()));
        return ApiResponse.<Page<Message>>builder()
                .result(getMessage)
                .build();
    }
}

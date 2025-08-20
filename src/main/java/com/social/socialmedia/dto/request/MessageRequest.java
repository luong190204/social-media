package com.social.socialmedia.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageRequest {
    private String conversationId;
    private String senderId;
    private String content;
}

package com.social.socialmedia.entity;

import com.social.socialmedia.enums.TypeContent;
import com.social.socialmedia.enums.StatusMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String conversationId;
    private String senderId;
    private TypeContent type;
    private String content;
    private LocalDateTime timestamp;
    private StatusMessage status;
}

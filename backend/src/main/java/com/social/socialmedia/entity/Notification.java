package com.social.socialmedia.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "notifications")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Notification {
    @Id
    private String id;

    private String receiverId; // người nhận tb
    private String senderId; // người tạo hành động
    private String type;
    private String postId;
    private String commentId;
    private boolean isRead;
    private String message;

    @CreatedDate
    private LocalDateTime createAt;
}

package com.social.socialmedia.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.social.socialmedia.enums.CommentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "comments")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Comment {
    @Id
    private String id;

    private String postId;
    private String userId;
    private String parentId; // id comment để reply, Có thể null

    private String content;

    private CommentStatus status;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}

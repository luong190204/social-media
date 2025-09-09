package com.social.socialmedia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentResponse {
    private String id;
    private String postId;
    private String userId;
    private String content;
    private String parentId;
    // optional
    private String authorName;   // lấy từ user
    private String authorAvatar;

    private Long countReplies; // danh sách reply

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

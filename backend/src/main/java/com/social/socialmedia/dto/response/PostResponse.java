package com.social.socialmedia.dto.response;

import com.social.socialmedia.enums.PostStatus;
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
public class PostResponse {
    private String id;
    private UserResponse author;
    private String content;
    private List<String> mediaUrls;
    private PostStatus status;

    private int totalLikes;
    private boolean likedByMe;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

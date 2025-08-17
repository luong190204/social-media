package com.social.socialmedia.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.social.socialmedia.enums.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "posts")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Post {
    @Id
    private String id;

    private String authorId;          // id của user (FK -> users._id)
    private String content;           // nội dung text

    private List<String> mediaUrls;   // danh sách link ảnh/video

    private PostStatus status;            // ACTIVE, DELETED, HIDDEN

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

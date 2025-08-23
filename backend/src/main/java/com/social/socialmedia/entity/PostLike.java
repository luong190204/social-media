package com.social.socialmedia.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "post_likes")
@JsonInclude(JsonInclude.Include.NON_NULL)
@CompoundIndex(name = "postId_userId_unique", def = "{'postId' : 1, 'userId' : 1}", unique = true)
public class PostLike {
    @Id
    private String id;

    private String postId;
    private String userId;

    @CreatedDate
    private LocalDateTime createdAt;
}

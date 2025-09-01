package com.social.socialmedia.dto.request;

import com.social.socialmedia.enums.PostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostCreateRequest {

    @NotBlank(message = "Content cannot be blank")
    @Size(max = 500, message = "Content must be less than 500 characters")
    private String content;
    private PostStatus status; // optional, default ACTIVE
}

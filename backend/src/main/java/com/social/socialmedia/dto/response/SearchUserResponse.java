package com.social.socialmedia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchUserResponse {
    private String id;
    private String username;
    private String fullName;
    private String profilePic;
    private String conversationId;
}

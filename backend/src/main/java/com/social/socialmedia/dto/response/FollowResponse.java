package com.social.socialmedia.dto.response;

import com.social.socialmedia.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class FollowResponse {
    private String id;
    private String username;
    private String fullName;
    private String profilePic;
    private boolean isVerified;
    private Status status; // online / offline
}

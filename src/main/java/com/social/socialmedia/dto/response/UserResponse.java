package com.social.socialmedia.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.social.socialmedia.enums.Gender;
import com.social.socialmedia.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    private String id;
    private String username;
    private String email;
    private String fullName;

    private String profilePic;
    private String bio;
    private String location;
    private Gender gender;
    private LocalDate dob;

    private boolean isVerified;
    private Status status;

    private List<String> friends;
    private List<String> followers;
    private List<String> following;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

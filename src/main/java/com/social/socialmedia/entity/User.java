package com.social.socialmedia.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.social.socialmedia.enums.Gender;
import com.social.socialmedia.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "users")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String fullName; // Tên hiển thị
    private String password;

    private Set<String> roles;

    private String profilePic;
    private String bio;

    @Builder.Default
    private List<String> friends = new ArrayList<>();

    @Builder.Default
    private List<String> followers = new ArrayList<>();  //id của người follow mình

    @Builder.Default
    private List<String> following = new ArrayList<>(); // id của người mình follow

    private String location;
    private Gender gender;
    private LocalDate dob;

    private boolean isVerified;
    private Status status;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}

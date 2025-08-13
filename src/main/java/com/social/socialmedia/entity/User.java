package com.social.socialmedia.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
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

    private List<ObjectId> friends;
    private List<ObjectId> followers;
    private List<ObjectId> following; // danh sách id mình theo dõi

    private String location;
    private String gender;
    private Instant dateOfBirth;

    private boolean isVerified;
    private String status;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

}

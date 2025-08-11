package com.social.socialmedia.mapper;

import com.social.socialmedia.dto.request.UserCreationRequest;
import com.social.socialmedia.dto.request.UserUpdateRequest;
import com.social.socialmedia.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}

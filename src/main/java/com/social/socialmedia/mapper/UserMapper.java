package com.social.socialmedia.mapper;

import com.social.socialmedia.dto.request.UserCreationRequest;
import com.social.socialmedia.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
}

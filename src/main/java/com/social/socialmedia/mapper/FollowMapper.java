package com.social.socialmedia.mapper;

import com.social.socialmedia.dto.response.FollowResponse;
import com.social.socialmedia.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface FollowMapper {

    FollowMapper INSTANCE = Mappers.getMapper(FollowMapper.class);

    FollowResponse toFollowResponse(User user);
}

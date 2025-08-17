package com.social.socialmedia.mapper;

import com.social.socialmedia.dto.request.PostCreateRequest;
import com.social.socialmedia.dto.request.PostUpdateRequest;
import com.social.socialmedia.dto.response.PostResponse;
import com.social.socialmedia.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PostMapper {
    Post toPost(PostCreateRequest request);
    PostResponse toPostResponse(Post post);
    void updatePost(@MappingTarget Post post, PostUpdateRequest request);
}

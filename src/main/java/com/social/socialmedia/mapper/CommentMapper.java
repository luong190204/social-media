package com.social.socialmedia.mapper;

import com.social.socialmedia.dto.request.CommentRequest;
import com.social.socialmedia.dto.response.CommentResponse;
import com.social.socialmedia.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    Comment toComment(CommentRequest commentRequest);
    CommentResponse toCommentResponse(Comment comment);
}

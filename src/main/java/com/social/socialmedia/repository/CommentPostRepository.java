package com.social.socialmedia.repository;

import com.social.socialmedia.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.awt.print.Pageable;
import java.util.List;

public interface CommentPostRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostIdAndParentId(String postId, String parentId, Pageable pageable);
    List<Comment> findByParentId(String parentId);
}

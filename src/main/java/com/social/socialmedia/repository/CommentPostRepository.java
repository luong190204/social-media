package com.social.socialmedia.repository;

import com.social.socialmedia.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentPostRepository extends MongoRepository<Comment, String> {
    Page<Comment> findByPostIdAndParentId(String postId, String parentId, Pageable pageable);
    Page<Comment> findByParentId(String parentId, Pageable pageable);

}

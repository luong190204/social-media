package com.social.socialmedia.repository;

import com.social.socialmedia.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByAuthorId(String authorId, Sort sort);

    Page<Post> findByAuthorIdInOrderByCreatedAtDesc(List<String> userIds, Pageable pageable);
}

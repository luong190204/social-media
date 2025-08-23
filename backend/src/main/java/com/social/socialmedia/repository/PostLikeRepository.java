package com.social.socialmedia.repository;

import com.social.socialmedia.entity.PostLike;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostLikeRepository extends MongoRepository<PostLike, String> {
    boolean existsByPostIdAndUserId(String postId, String userId);
    int countByPostId(String postId);
    void deleteByPostIdAndUserId(String postId, String userId);
}

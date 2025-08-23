package com.social.socialmedia.repository;

import com.social.socialmedia.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
}

package com.social.socialmedia.repository;

import com.social.socialmedia.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}

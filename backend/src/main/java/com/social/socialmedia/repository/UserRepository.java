package com.social.socialmedia.repository;

import com.social.socialmedia.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);

    // Search user
    List<User> findByUsernameContainingIgnoreCase(String username);

    List<User> findByIdInAndFullNameContainingIgnoreCase(List<String> ids, String fullName);
}

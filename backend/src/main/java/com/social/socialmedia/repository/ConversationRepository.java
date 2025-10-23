package com.social.socialmedia.repository;

import com.social.socialmedia.entity.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends MongoRepository<Conversation, String> {
    List<Conversation> findByParticipantsContaining(String userId);

    // Query all kiểm tra 2 phần tử không quan tâm thứ tự
    @Query("{ 'participants': { $all: ?0 } }")
    Optional<Conversation> findByParticipants(List<String> participants);
}

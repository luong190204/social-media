package com.social.socialmedia.repository;

import com.social.socialmedia.entity.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends MongoRepository<Conversation, String> {
    List<Conversation> findByParticipantsContaining(String userId);
    Optional<Conversation> findByParticipants(List<String> participants);
}

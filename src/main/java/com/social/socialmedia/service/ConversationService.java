package com.social.socialmedia.service;

import com.social.socialmedia.entity.Conversation;
import com.social.socialmedia.repository.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConversationService {
    @Autowired
    private ConversationRepository conversationRepository;

    public Conversation createConversation(List<String> participantIds) {
        // Sort để đảm bảo [userId1, userId2] không bị trùng với [userId2, userId1]
        List<String> sortedParticipants = participantIds.stream().sorted().toList();
        Optional<Conversation> existing = conversationRepository.findByParticipants(sortedParticipants);

        if (existing.isPresent()) {
            return existing.get();
        }

        Conversation conversation = Conversation.builder()
                .participants(sortedParticipants)
                .createdAt(LocalDateTime.now())
                .unReadCount(sortedParticipants.stream().collect(Collectors.toMap(id -> id, id -> 0)))
                .build();

        return conversationRepository.save(conversation);
    }

    public List<Conversation> getUsersConversations(String userId) {
        return conversationRepository.findByParticipantsContaining(userId);
    }
}

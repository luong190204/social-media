package com.social.socialmedia.service;

import com.social.socialmedia.configuration.SecurityUtils;
import com.social.socialmedia.dto.response.ConversationResponse;
import com.social.socialmedia.entity.Conversation;
import com.social.socialmedia.entity.Message;
import com.social.socialmedia.entity.User;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.repository.ConversationRepository;
import com.social.socialmedia.repository.MessageRepository;
import com.social.socialmedia.repository.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    public Conversation createConversation(List<String> participantIds) {

        // Kiểm tra user đăng nhập
        String currentUserId = SecurityUtils.getCurrentUserId();
        System.out.println("Id user: " + currentUserId);

        // Kiểm tra người dùng hiện tại có trong List participants không
        if (!participantIds.contains(currentUserId)) throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (participantIds.size() != 2) throw new AppException(ErrorCode.PARTICIPANTS_NOT_TWO);

        // Sort để đảm bảo [userId1, userId2] không bị trùng với [userId2, userId1]
        List<String> sortedParticipants = participantIds.stream().sorted().toList();
        Optional<Conversation> existing = conversationRepository.findByParticipants(sortedParticipants);

        // Nếu đã có thì trả về luôn
        if (existing.isPresent()) {
            return existing.get();
        }

        Conversation conversation = Conversation.builder()
                .participants(sortedParticipants)
                .createdAt(LocalDateTime.now())
                // Map id participant và gán giá trị bằng 0
                .unReadCount(sortedParticipants.stream().collect(Collectors.toMap(id -> id, id -> 0)))
                .build();

        return conversationRepository.save(conversation);
    }

    public List<Conversation> getUsersConversations() {

        String currentUserId = SecurityUtils.getCurrentUserId();

        return conversationRepository.findByParticipantsContaining(currentUserId);
    }

    public List<ConversationResponse> getConversationsListForSidebar() {
        String currentUserId = SecurityUtils.getCurrentUserId();
        List<Conversation> conversations = conversationRepository.findByParticipantsContaining(currentUserId);

        return conversations.stream().map(conv -> {
            String partnerId = conv.getParticipants().stream()
                    .filter(id -> !id.equals(currentUserId))
                    .findFirst()
                    .orElse(null);

            User partner = userRepository.findById(partnerId).orElseThrow(() -> new AppException(ErrorCode.USER_FOUND));

            Message lastMessage = null;
            if (conv.getLastMessageId() != null) {
                lastMessage = messageRepository.findById(conv.getLastMessageId()).orElse(null);
            }

            return ConversationResponse.builder()
                    .id(conv.getId())
                    .partnerId(partner.getId())
                    .partnerName(partner.getFullName())
                    .partnerAvatar(partner.getProfilePic())
                    .lastMessageContent(lastMessage != null ? lastMessage.getContent() : null)
                    .lastMessageTime(lastMessage != null ? lastMessage.getTimestamp() : null)
                    .unreadCount(conv.getUnReadCount().getOrDefault(currentUserId, 0))
                    .build();
        }).toList();
    }
}

package com.social.socialmedia.service;

import com.social.socialmedia.dto.request.MessageRequest;
import com.social.socialmedia.entity.Conversation;
import com.social.socialmedia.entity.Message;
import com.social.socialmedia.enums.StatusMessage;
import com.social.socialmedia.enums.TypeContent;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.repository.ConversationRepository;
import com.social.socialmedia.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    public Message sendTextMessage(MessageRequest request) {
        Conversation conversation = conversationRepository.findById(request.getConversationId()).orElseThrow(
                () -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        if (!conversation.getParticipants().contains(request.getSenderId())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        Message message = Message.builder()
                .conversationId(request.getConversationId())
                .senderId(request.getSenderId())
                .type(TypeContent.TEXT)
                .content(request.getContent())
                .timestamp(LocalDateTime.now())
                .status(StatusMessage.SENT)
                .build();
        messageRepository.save(message);

        // update conversation
        updateConversation(conversation, message, request.getSenderId());

        // Realtime Socket
        simpMessagingTemplate.convertAndSend("/topic/conversation/" + request.getConversationId(), message);
        return message;
    }

    public Message senImageMessage(String conversationId, String senderId, MultipartFile image) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(
                () -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        if (!conversation.getParticipants().contains(senderId)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Upload image to Cloudinary
        String imageUrl = cloudinaryService.uploadFile(image);

        Message message = Message.builder()
                .conversationId(conversationId)
                .senderId(senderId)
                .type(TypeContent.IMAGE)
                .content(imageUrl)
                .timestamp(LocalDateTime.now())
                .status(StatusMessage.SENT)
                .build();
        messageRepository.save(message);

        // Update conversation
        updateConversation(conversation, message, senderId);
        return message;
    }

    private void updateConversation(Conversation conversation, Message message, String senderId) {
        // Set TN cuối cùng vào
        conversation.setLastMessageId(message.getId());
        String receiverId = conversation.getParticipants().stream()
                .filter(id -> !id.equals(senderId))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.RECEIVER_NOT_FOUND));

        conversation.getUnReadCount().put(receiverId, conversation.getUnReadCount().getOrDefault(receiverId, 0) + 1);
        conversationRepository.save(conversation);
    }

    public Page<Message> getMessages(String conversationId, Pageable pageable) {
        return messageRepository.findByConversationId(conversationId, pageable);
    }
}

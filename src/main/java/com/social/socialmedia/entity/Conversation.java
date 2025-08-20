package com.social.socialmedia.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "conversations")
public class Conversation {
    @Id
    private String id;
    private List<String> participants;  // List of userId
    private LocalDateTime createdAt;
    private String lastMessageId;
    private Map<String, Integer> unReadCount;  // Map<userId, count>
}

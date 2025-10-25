package com.social.socialmedia.entity;

import com.social.socialmedia.enums.CallStatus;
import com.social.socialmedia.enums.CallType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "calls")
public class Call {
    @Id
    private String id;

    @Indexed
    private String callerId;    // Người gọi
    @Indexed
    private String calleeId;     // Người nhận

    @Indexed
    private String conversationId; // Link với conversation

    private CallType type;    // VIDEO, AUDIO
    @Indexed
    private CallStatus status;   // RINGING, CONNECTED, ENDED, MISSED, REJECTED

    @Indexed
    private LocalDateTime createdAt;
    private LocalDateTime startedAt;   // Thời điểm bắt đầu kết nối
    private LocalDateTime endedAt;     // Thời điểm kết thúc
    private Long duration;       // Tổng thời lượng (s)

    // metadata
    private String roomId; // RoomId cho WebRTC

    @Builder.Default
    private Map<String, Object> metadata = new HashMap<>(); // Quality metrics, etc.

    // Helper methods
    public void setMetadataValue(String key, Object value) {
        if (this.metadata == null) {
            this.metadata = new HashMap<>();
        }
        this.metadata.put(key, value);
    }

    public Object getMetadataValue(String key) {
        return this.metadata != null ? this.metadata.get(key) : null;
    }
}

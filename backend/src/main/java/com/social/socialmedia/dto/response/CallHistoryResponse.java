package com.social.socialmedia.dto.response;

import com.social.socialmedia.enums.CallStatus;
import com.social.socialmedia.enums.CallType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CallHistoryResponse {
    private String callId;

    private String callerId;

    private String callerName;

    private String callerAvatar;

    private String calleeId;

    private String calleeName;

    private String calleeAvatar;

    private CallType type;

    private CallStatus status;

    private LocalDateTime createdAt;

    private Long durationSeconds;

    private boolean isIncoming;
}

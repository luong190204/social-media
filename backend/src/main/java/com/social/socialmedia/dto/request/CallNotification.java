package com.social.socialmedia.dto.request;

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
public class CallNotification {
    private String callId;

    private String callerId;

    private String callerName;

    private String callerAvatar;

    private CallType type;

    private String roomId;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}

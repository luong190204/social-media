package com.social.socialmedia.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CallEndNotification {
    private String callId;

    private Long durationSeconds;

    @Builder.Default
    private LocalDateTime endedAt = LocalDateTime.now();

    private String reason;
}

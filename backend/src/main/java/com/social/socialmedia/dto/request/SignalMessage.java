package com.social.socialmedia.dto.request;

import com.social.socialmedia.enums.SignalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignalMessage {
    private String callId;

    private String senderId;

    private String targetUserId;

    private SignalType type;

    private Object offer;

    private Object answer;

    private Object candidate;

    private Map<String, Object> metadata;
}

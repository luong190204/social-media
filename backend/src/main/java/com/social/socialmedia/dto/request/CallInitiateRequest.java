package com.social.socialmedia.dto.request;

import com.social.socialmedia.enums.CallType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CallInitiateRequest {
    @NotNull(message = "Callee ID is required")
    private String calleeId;

    private String callerName;

    private String callerAvatar;

    @NotNull(message = "Call type is required")
    private CallType type;

    private Map<String, Object> metadata;
}

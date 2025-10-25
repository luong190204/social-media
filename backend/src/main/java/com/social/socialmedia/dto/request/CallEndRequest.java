package com.social.socialmedia.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CallEndRequest {
    @NotNull(message = "Call ID is required")
    private String callId;

    private String reason;

    private Map<String, Object> metadata;
}

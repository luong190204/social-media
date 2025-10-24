// để truyền offer/answer/ICE giữa 2 user.
package com.social.socialmedia.controller;

import com.social.socialmedia.dto.request.SignalingMessage;
import com.social.socialmedia.service.CallService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class SignalingController {
    private final SimpMessagingTemplate messagingTemplate;
    private final CallService callService;

    @MessageMapping("/call.send")
    public void handleSignaling(@Payload SignalingMessage msg, Principal principal) {
        msg.setFrom(principal.getName());

        // Xử lý logic tùy loại signaling
        switch (msg.getType()) {
            case "offer":
                boolean isVideo = msg.getMetadata() != null && Boolean.TRUE.equals(msg.getMetadata().get("isVideo"));
                callService.createCall(msg.getFrom(), msg.getTo(), isVideo);
                break;
            case "answer":
                callService.markConnected(msg.getCallId());
                break;
            case "end":
                callService.markEnd(msg.getCallId());
                break;
            case "reject":
                callService.markRejected(msg.getCallId());
                break;
            default:
                break;
        }

        // Gửi message đến user đích
        messagingTemplate.convertAndSendToUser(msg.getTo(), "queue/call", msg);
    }
}

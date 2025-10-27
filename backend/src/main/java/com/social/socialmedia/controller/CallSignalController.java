package com.social.socialmedia.controller;

import com.social.socialmedia.dto.request.*;
import com.social.socialmedia.entity.Call;
import com.social.socialmedia.enums.CallStatus;
import com.social.socialmedia.service.CallService;
import com.social.socialmedia.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
@Slf4j
public class CallSignalController {
    private final CallService callService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    // Khởi tạo cuộc gọi
    @MessageMapping("/call.initiate")
    public void initiateCall(@Payload CallInitiateRequest request, Principal principal) {
        try {
            String callerId = principal.getName();
            log.info("===========================================");
            log.info("🔵 CALL INITIATE REQUEST");
            log.info("   Caller ID: {}", callerId);
            log.info("   Callee ID: {}", request.getCalleeId());
            log.info("   Caller Name: {}", request.getCallerName());
            log.info("   Type: {}", request.getType());
            log.info("===========================================");

            // Tạo cuộc gọi
            Call call = callService.initiateCall(callerId, request.getCalleeId(), request.getType());
            log.info("✅ Call created with ID: {}", call.getId());

            // Tạo notification
            CallNotification notification = CallNotification.builder()
                    .callId(call.getId())
                    .callerId(callerId)
                    .callerName(request.getCallerName())
                    .callerAvatar(request.getCallerAvatar())
                    .type(call.getType())
                    .roomId(call.getRoomId())
                    .timestamp(LocalDateTime.now())
                    .build();

            log.info("===========================================");
            log.info("📤 SENDING NOTIFICATION TO CALLEE");
            log.info("   Destination: /user/{}/queue/call.incoming", request.getCalleeId());
            log.info("   Notification: {}", notification);
            log.info("===========================================");

            // ✅ Gửi đến người nhận
            messagingTemplate.convertAndSendToUser(
                    request.getCalleeId(),
                    "/queue/call.incoming",
                    notification
            );

            log.info("🟢 Notification sent to user: {}", request.getCalleeId());

            // Gửi confirmation cho người gọi
            messagingTemplate.convertAndSendToUser(
                    callerId,
                    "/queue/call.initiated",
                    call
            );

            log.info("🟢 Confirmation sent to caller: {}", callerId);
            log.info("===========================================");

        } catch (Exception e) {
            log.error("❌ ERROR in initiateCall: {}", e.getMessage(), e);
            messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/errors",
                    "Failed to initiate call: " + e.getMessage()
            );
        }
    }

    // Trả lời cuộc gọi
    @MessageMapping("/call.answer")
    public void answerCall(@Payload CallAnswerRequest request, Principal principal) {
        try {
            String calleeId = principal.getName();
            log.info("User {} answering call {}", calleeId, request.getCallId());

            Call call = callService.getCallById(request.getCallId());

            if (request.getAccepted()) {
                // Chấp nhận cuộc gọi
                call = callService.updateCallStatus(request.getCallId(), CallStatus.ONGOING);

                // Thông báo cho người gọi
                messagingTemplate.convertAndSendToUser(call.getCallerId(), "/queue/call.accepted", call);
                log.info("Call {} accepted", call.getId());
            } else {
                // Từ chối cuộc gọi
                call = callService.rejectCall(request.getCallId(), "User declined");
                // Thông báo cho người gọi
                CallEndNotification endNotification = CallEndNotification.builder()
                        .callId(call.getId())
                        .durationSeconds(0L)
                        .endedAt(LocalDateTime.now())
                        .reason("Call rejected")
                        .build();

                messagingTemplate.convertAndSendToUser(
                        call.getCallerId(),
                        "/queue/call.rejected",
                        endNotification
                );

                log.info("Call {} rejected", call.getId());
            }
        } catch (Exception e) {
            log.error("Error answering call", e);
            messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/errors",
                    "Failed to answer call: " + e.getMessage()
            );
        }
    }

    // Gửi WebRTC offer
    @MessageMapping("/call.offer")
    public void handleOffer(@Payload SignalMessage signal, Principal principal) {
        try {
            String senderId = principal.getName();
            log.info("Forwarding offer from {} to {}", senderId, signal.getTargetUserId());

            signal.setSenderId(senderId);
            messagingTemplate.convertAndSendToUser(
                    signal.getTargetUserId(),
                    "/queue/call.signal",
                    signal
            );
        } catch (Exception e) {
            log.error("Error handling offer", e);
        }
    }

    // Gửi WebRTC answer
    @MessageMapping("/call.answer-signal")
    public void handleAnswerSignal(@Payload SignalMessage signal, Principal principal) {
        try {
            String senderId = principal.getName();
            log.info("Forwarding answer from {} to {}", senderId, signal.getTargetUserId());

            signal.setSenderId(senderId);

            messagingTemplate.convertAndSendToUser(
                    signal.getTargetUserId(),
                    "/queue/call.signal",
                    signal
            );

        } catch (Exception e) {
            log.error("Error handling answer signal", e);
        }
    }

    // Gửi ICE candidates
    @MessageMapping("/call.ice-candidate")
    public void handleIceCandidate(@Payload SignalMessage signal, Principal principal) {
        try {
            String senderId = principal.getName();
            log.debug("Forwarding ICE candidate from {} to {}", senderId, signal.getTargetUserId());

            signal.setSenderId(senderId);

            messagingTemplate.convertAndSendToUser(
                    signal.getTargetUserId(),
                    "/queue/call.signal",
                    signal
            );

        } catch (Exception e) {
            log.error("Error handling ICE candidate", e);
        }
    }

    // Kết thúc cuộc gọi
    @MessageMapping("/call.end")
    public void endCall(@Payload CallEndRequest request, Principal principal) {
        try {
            String userId = principal.getName();
            log.info("User {} ending call {}", userId, request.getCallId());

            Call call = callService.endCall(request.getCallId(), request.getReason());

            // Tạo thông báo kết thúc
            CallEndNotification notification = CallEndNotification.builder()
                    .callId(call.getId())
                    .durationSeconds(call.getDuration())
                    .endedAt(call.getEndedAt())
                    .reason(request.getReason())
                    .build();

            // Gửi cho cả hai bên
            messagingTemplate.convertAndSendToUser(
                    call.getCallerId(),
                    "/queue/call.ended",
                    notification
            );

            messagingTemplate.convertAndSendToUser(
                    call.getCalleeId(),
                    "/queue/call.ended",
                    notification
            );

            log.info("Call {} ended successfully. Duration: {} seconds",
                    call.getId(), call.getDuration());

        } catch (Exception e) {
            log.error("Error ending call", e);
            messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/errors",
                    "Failed to end call: " + e.getMessage()
            );
        }
    }

    // Hủy cuộc gọi (trước khi người kia bắt máy)
    @MessageMapping("/call.cancel")
    public void cancelCall(@Payload CallEndRequest request, Principal principal) {
        try {
            String userId = principal.getName();
            log.info("User {} cancelling call {}", userId, request.getCallId());

            Call call = callService.cancelCall(request.getCallId());

            // Thông báo cho người nhận
            CallEndNotification notification = CallEndNotification.builder()
                    .callId(call.getId())
                    .durationSeconds(0L)
                    .endedAt(call.getEndedAt())
                    .reason("Call cancelled")
                    .build();

            messagingTemplate.convertAndSendToUser(
                    call.getCalleeId(),
                    "/queue/call.cancelled",
                    notification
            );

            log.info("Call {} cancelled", call.getId());

        } catch (Exception e) {
            log.error("Error cancelling call", e);
            messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/errors",
                    "Failed to cancel call: " + e.getMessage()
            );
        }
    }
}

package com.social.socialmedia.service;

import com.social.socialmedia.entity.Call;
import com.social.socialmedia.enums.CallStatus;
import com.social.socialmedia.enums.CallType;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.repository.CallRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.ResourceAccessException;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CallService {
    private final CallRepository callRepository;

   // Tạo record mới khi user A bắt đầu gọi user B, Khởi tạo cuộc gọi mới
    @Transactional
    public Call initiateCall(String callerId, String calleeId, CallType type) {
        log.info("Initiating call from {} to {} with type {}", callerId, calleeId, type);

        // Kiểm tra xem user có đang trong cuộc gọi khác không
        Optional<Call> activeCall = callRepository.findActiveCallByUserId(callerId);
        if (activeCall.isPresent()) {
            throw new AppException(ErrorCode.CALL_NOT_FOUND);
        }
        Call call = Call.builder()
                .callerId(callerId)
                .calleeId(calleeId)
                .type(type)
                .status(CallStatus.RINGING)
                .createdAt(LocalDateTime.now())
                .roomId(UUID.randomUUID().toString())
                .build();

        Call saved = callRepository.save(call);
        return saved;
    }

    // Cập nhật trạng thái cuộc gọi
    public Call updateCallStatus(String callId, CallStatus status) {
        log.info("Updating call {} to status {}", callId, status);

        Call call = callRepository.findById(callId).orElseThrow(
                () -> new AppException(ErrorCode.CALL_NOT_FOUND));
        call.setStatus(status);

        // Nếu cuộc gọi bắt đầu, ghi lại thời gian bắt đầu
        if (status == CallStatus.ONGOING && call.getStartedAt() == null) {
            call.setStartedAt(LocalDateTime.now());
        }

        // Nếu cuộc gọi kết thúc, tính thời lượng
        if (isEndStatus(status) && call.getEndedAt() == null) {
            call.setEndedAt(LocalDateTime.now());
            calculateDuration(call);
        }

        return callRepository.save(call);
    }

    // Kết thúc cuộc gọi
    @Transactional
    public Call endCall(String callId, String reason) {
        log.info("Ending call {} with reason: {}", callId, reason);

        Call call = callRepository.findById(callId)
                .orElseThrow(() -> new AppException(ErrorCode.CALL_NOT_FOUND));

        call.setStatus(CallStatus.ENDED);
        call.setEndedAt(LocalDateTime.now());

        if (reason != null) {
            call.setMetadataValue("endReason", reason);
        }
        calculateDuration(call);

        return callRepository.save(call);
    }

    // Từ chối cuộc gọi
    @Transactional
    public Call rejectCall(String callId, String reason) throws BadRequestException {
        log.info("Rejecting call {} with reason: {}", callId, reason);

        Call call = callRepository.findById(callId)
                .orElseThrow(() -> new AppException(ErrorCode.CALL_NOT_FOUND));

        if (call.getStatus() != CallStatus.REJECTED) {
            throw new BadRequestException("Can only reject ringing calls");
        }

        call.setStatus(CallStatus.REJECTED);
        call.setEndedAt(LocalDateTime.now());

        if (reason != null) {
            call.setMetadataValue("rejectReason", reason);
        }

        return callRepository.save(call);
    }

    // Đánh dấu cuộc gọi nhỡ
    public Call markAsMissed(String callId) {
        log.info("Marking call {} as missed", callId);

        Call call = callRepository.findById(callId)
                .orElseThrow(() -> new AppException(ErrorCode.CALL_NOT_FOUND));

        call.setStatus(CallStatus.MISSED);
        call.setEndedAt(LocalDateTime.now());

        return callRepository.save(call);
    }

    // Hủy cuộc gọi (người gọi hủy trước khi người nhận bắt máy)
    @Transactional
    public Call cancelCall(String callId) throws BadRequestException {
        log.info("Cancelling call {}", callId);

        Call call = callRepository.findById(callId)
                .orElseThrow(() -> new AppException(ErrorCode.CALL_NOT_FOUND));

        if (call.getStatus() != CallStatus.RINGING) {
            throw new BadRequestException("Can only cancel ringing calls");
        }

        call.setStatus(CallStatus.CANCELLED);
        call.setEndedAt(LocalDateTime.now());

        return callRepository.save(call);
    }

    // Lấy lịch sử cuộc gọi
    public Page<Call> getCallHistory(String userId, Pageable pageable) {
        return callRepository.findByCallerIdOrCalleeIdOrderByCreatedAtDesc(userId, userId, pageable);
    }

    // Lấy cuộc gọi nhỡ
    public List<Call> getMissedCalls(String userId) {
        return callRepository.findByCalleeIdAndStatus(userId, CallStatus.MISSED);
    }

    // Đếm cuộc gọi nhỡ
    public long countMissedCalls(String userId) {
        return callRepository.countMissedCalls(userId);
    }

    // Lấy chi tiết cuộc gọi
    public Call getCallById(String callId) {
        return callRepository.findById(callId).orElseThrow(() -> new AppException(ErrorCode.CALL_NOT_FOUND));
    }

    // Kiểm tra user có đang trong cuộc gọi không
    public Optional<Call> getActiveCall(String userId) {
        return callRepository.findActiveCallByUserId(userId);
    }

    private void calculateDuration(Call call) {
        if (call.getStartedAt() != null && call.getEndedAt() != null) {
            long duration = ChronoUnit.SECONDS.between(call.getStartedAt(), call.getEndedAt());
            call.setDuration(Math.max(0, duration));
        } else {
            call.setDuration(0l);
        }
    }

    private boolean isEndStatus(CallStatus status) {
        return status == CallStatus.ENDED
                || status == CallStatus.MISSED
                || status == CallStatus.REJECTED
                || status == CallStatus.FAILED
                || status == CallStatus.CANCELLED;
    }
}

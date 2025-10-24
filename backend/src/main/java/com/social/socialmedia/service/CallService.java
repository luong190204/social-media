package com.social.socialmedia.service;

import com.social.socialmedia.entity.CallRecord;
import com.social.socialmedia.enums.CallStatus;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.repository.CallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CallService {
    private final CallRepository callRepository;

    // Tạo record mới khi user A bắt đầu gọi user B
    public CallRecord createCall(String callerId, String calleeId, boolean isVideo) {
        CallRecord callRecord = CallRecord.builder()
                .callId(UUID.randomUUID().toString())
                .callerId(callerId)
                .calleeId(calleeId)
                .isVideo(isVideo)
                .status(CallStatus.RINGING)
                .startTime(Instant.now())
                .build();

        return callRepository.save(callRecord);
    }

    // Khi người nhận nhấc máy
    public void markConnected(String callId) {
        callRepository.findByCallId(callId).ifPresent(record -> {
            record.setStatus(CallStatus.CONNECTED);
            record.setStartTime(Instant.now());
            callRepository.save(record);
        });
    }

    // khi cuộc gọi kết thúc
    public void markEnd(String callId) {
        callRepository.findByCallId(callId).ifPresent(record -> {
            record.setStatus(CallStatus.ENDED);
            record.setEndTime(Instant.now());

            if (record.getStartTime() != null && record.getEndTime() != null) {
                record.setDuration(Duration.between(record.getStartTime(), record.getEndTime()).getSeconds());
            }
            callRepository.save(record);
        });
    }

    // Khi người nhận không bắt máy
    public void markMissed(String callId) {
        callRepository.findByCallId(callId).ifPresent(record -> {
            record.setStatus(CallStatus.MISSED);
            record.setEndTime(Instant.now());
            callRepository.save(record);
        });
    }

    // Khi người nhận từ chối
    public void markRejected(String callId) {
        callRepository.findByCallId(callId).ifPresent(record -> {
            record.setStatus(CallStatus.REJECTED);
            record.setEndTime(Instant.now());
            callRepository.save(record);
        });
    }

    // Lấy lịch sử tất cả các cuộc gọi của user
    public List<CallRecord> getHistory(String userId) {
        return callRepository.findByCallerIdOrCalleeIdOrderByStartTimeDesc(userId, userId);
    }

    //Lấy chi tiết một cuộc gọi
    public CallRecord getByCallId(String callId) {
         CallRecord callRecord = callRepository.findByCallId(callId).orElseThrow(
                 () -> new AppException(ErrorCode.CALL_RECORD_NOT_FOUND));

         return callRecord;
    }

}

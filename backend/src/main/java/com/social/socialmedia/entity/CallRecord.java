package com.social.socialmedia.entity;

import com.social.socialmedia.enums.CallStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "call_records")
public class CallRecord {
    @Id
    private String id;

    private String callId;       // Mã cuộc gọi (UUID)
    private String callerId;     // Người gọi
    private String calleeId;     // Người nhận
    private boolean isVideo;     // True = video call, False = voice call

    private CallStatus status;   // RINGING, CONNECTED, ENDED, MISSED, REJECTED

    private Instant startTime;   // Thời điểm bắt đầu kết nối
    private Instant endTime;     // Thời điểm kết thúc
    private Long duration;       // Tổng thời lượng (s)

    private String note;         // Ghi chú hoặc lỗi (nếu có)
}

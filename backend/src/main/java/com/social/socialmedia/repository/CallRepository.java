package com.social.socialmedia.repository;

import com.social.socialmedia.entity.Call;
import com.social.socialmedia.enums.CallStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CallRepository extends MongoRepository<Call, String> {
    // Tìm tất cả cuộc gọi của user (cả caller và callee)
    @Query("{ $or: [ { 'callerId': ?0 }, { 'calleeId': ?0 } ] }")
    Page<Call> findByCallerIdOrCalleeIdOrderByCreatedAtDesc(
            String userId1, String userId2, Pageable pageable);

    // Tìm cuộc gọi nhỡ
    List<Call> findByCalleeIdAndStatus(String calleeId, CallStatus status);

    // Tìm cuộc gọi nhỡ gần đây
    @Query("{ 'calleeId': ?0, 'status': 'MISSED', 'createdAt': { $gte: ?1 } }")
    List<Call> findRecentMissedCalls(String userId, LocalDateTime since);

    // Tìm cuộc gọi đang diễn ra của user
    @Query("{ $or: [ { 'callerId': ?0, 'status': { $in: ['RINGING', 'ONGOING'] } }, " +
            "{ 'calleeId': ?0, 'status': { $in: ['RINGING', 'ONGOING'] } } ] }")
    Optional<Call> findActiveCallByUserId(String userId);

    // Đếm cuộc gọi nhỡ chưa xem
    @Query(value = "{ 'calleeId': ?0, 'status': 'MISSED' }", count = true)
    long countMissedCalls(String userId);

    // Optional<Call> findByCallId(String callId);

    // List<Call> findByCallerIdOrCalleeIdOrderByStartTimeDesc(String callerId, String calleeId);
}

package com.social.socialmedia.repository;

import com.social.socialmedia.entity.CallRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CallRepository extends MongoRepository<CallRecord, String> {
    Optional<CallRecord> findByCallId(String callId);

    List<CallRecord> findByCallerIdOrCalleeIdOrderByStartTimeDesc(String callerId, String calleeId);
}

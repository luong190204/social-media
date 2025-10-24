package com.social.socialmedia.dto.request;

import lombok.Data;

import java.util.Map;

@Data
public class SignalingMessage {
    private String type;           // offer, answer, ice, end
    private String from;           // người gửi
    private String to;             // người nhận
    private String callId;         // id cuộc gọi
    private String sdp;            // SDP offer/answer
    private Object candidate;      // ICE candidate (JSON)
    private Map<String, Object> metadata; // chứa thêm thông tin (isVideo, name,...)

}

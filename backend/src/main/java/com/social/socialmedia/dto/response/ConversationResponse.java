// trả về user đang nhắn tin với user chính
package com.social.socialmedia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConversationResponse {
    private String id;
    private String partnerId;
    private String partnerName;
    private String partnerAvatar;
    private String lastMessageContent;
    private LocalDateTime lastMessageTime;
    private Integer unReadCount;
}

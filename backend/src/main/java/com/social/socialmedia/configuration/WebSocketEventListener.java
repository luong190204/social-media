package com.social.socialmedia.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Danh sách user đang online
    private final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();

    @EventListener
    public void handleSessionConnectedEvent(SessionConnectEvent event) {
        String userId = event.getUser().getName();
        onlineUsers.add(userId);

        // Gửi danh sách online cho tất cả người khác (broadcast)
        messagingTemplate.convertAndSend("/topic/onlineUsers", onlineUsers);

        // Gửi riêng cho user vừa connect danh sách hiện tại
        messagingTemplate.convertAndSendToUser(userId, "/queue/onlineUsers", onlineUsers);
    }
}

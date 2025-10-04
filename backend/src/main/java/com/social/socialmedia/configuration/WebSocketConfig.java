package com.social.socialmedia.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Đăng ký broker (nơi client có thể SUBSCRIBE)
        registry.enableSimpleBroker("/topic"); // Tin nhắn gửi tới /topic/... sẽ được broadcast
        registry.setApplicationDestinationPrefixes("/app"); // Prefix cho client gửi lên server
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint để client connect
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Cho phép frontend connect
                .withSockJS(); // Hỗ trợ fallback
    }
}

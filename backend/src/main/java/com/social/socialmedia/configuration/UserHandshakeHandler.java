// UserHandshakeHandler (DefaultHandshakeHandler subclass): dùng token từ attributes, decode JWT (dùng CustomJwtDecoder qua JwtUtils),
// tạo Principal (Principal.getName() = userId).
//
//Kết quả: Session WebSocket được Spring gán Principal = userId.
package com.social.socialmedia.configuration;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

public class UserHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected Principal determineUser(ServerHttpRequest request,
                                      WebSocketHandler wsHandler,
                                      Map<String, Object> attributes) {
        String token = (String) attributes.get("token");
        if (token == null) return null;

        String userId = JwtUtils.getUserIdFromToken(token);
        if (userId == null) return null;

        return () -> userId; // Principal.getName() = userId

    }
}

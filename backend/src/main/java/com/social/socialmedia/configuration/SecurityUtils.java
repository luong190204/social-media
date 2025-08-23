package com.social.socialmedia.configuration;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class SecurityUtils {


    // Phương thức lấy ra ID từ jwt
    public static String getCurrentUserId() {
        var authenticate = SecurityContextHolder.getContext().getAuthentication();

        //  kiểm tra xem đối tượng authenticate có phải là một instance của JwtAuthenticationToken hay không.
        if (authenticate instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthToken = (JwtAuthenticationToken) authenticate;
            return jwtAuthToken.getTokenAttributes().get("id").toString();
        }

        return null;
    }
}

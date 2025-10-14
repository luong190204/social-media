package com.social.socialmedia.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {

    private static CustomJwtDecoder jwtDecoder;

    @Autowired
    public JwtUtils(CustomJwtDecoder decoder) {
        jwtDecoder = decoder;
    }

    public static String getUserIdFromToken(String token) {
        try {
            Jwt decoded = jwtDecoder.decode(token);

            Object idClaim = decoded.getClaims().get("id");
            if (idClaim == null) idClaim = decoded.getClaims().get("sub");
            if (idClaim == null) idClaim = decoded.getClaims().get("id");
            if (idClaim == null) idClaim = decoded.getClaims().get("username");

            return idClaim != null ? idClaim.toString() : null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

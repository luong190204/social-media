package com.social.socialmedia.configuration;

import com.social.socialmedia.repository.CommentPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

// custom để check quyền: Ngươi đang login có trùng với userId comment không
@Component("commentSecurity")
public class CommentSecurity {

    @Autowired
    private CommentPostRepository commentPostRepository;

    public boolean isAuthor (String commentId, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();

        String userId = jwt.getClaim("id");

        return commentPostRepository.findById(commentId)
                .map(comment -> comment.getUserId().equals(userId))
                .orElse(false);
    }

    // cho phép thêm Admin
    public boolean isAuthorOrAdmin (String commentId, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = jwt.getClaim("id");
        String role = jwt.getClaim("scope");

        return "ADMIN".equals(role) || commentPostRepository.findById(commentId)
                .map(comment -> comment.getUserId().equals(userId))
                .orElse(false);
    }
}



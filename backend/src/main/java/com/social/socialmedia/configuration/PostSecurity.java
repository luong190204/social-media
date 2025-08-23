package com.social.socialmedia.configuration;

import com.social.socialmedia.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

// custom để check quyền: Ngươi đang login có trùng với userId đăng bài không
@Component("postSecurity")
public class PostSecurity {

    @Autowired
    private PostRepository postRepository;

    public boolean isAuthor(String postId, Authentication authentication) {
        // lấy JWT từ authentication
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = jwt.getClaim("id");

        // lấy post từ db
        return postRepository.findById(postId)
                .map(post -> post.getAuthorId().equals(userId))
                .orElse(false);
    }
}

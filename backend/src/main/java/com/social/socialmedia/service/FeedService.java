package com.social.socialmedia.service;

import com.social.socialmedia.configuration.SecurityUtils;
import com.social.socialmedia.dto.response.PostResponse;
import com.social.socialmedia.dto.response.UserResponse;
import com.social.socialmedia.entity.Post;
import com.social.socialmedia.entity.User;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.mapper.PostMapper;
import com.social.socialmedia.repository.PostLikeRepository;
import com.social.socialmedia.repository.PostRepository;
import com.social.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.domain.PageImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class FeedService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private PostMapper postMapper;

    public Page<PostResponse> getFeed(int page, int size) {
        String currentUserId = SecurityUtils.getCurrentUserId();

        User currentUser = userRepository.findById(currentUserId).orElseThrow(
                () -> new AppException(ErrorCode.USER_FOUND));

        List<String> followingIds = currentUser.getFollowing();

        // Nếu chưa follow ai thì trả về rỗng
        if (followingIds == null || followingIds.isEmpty()) {
            return Page.empty();
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Post> postPage = postRepository.findByAuthorIdInOrderByCreatedAtDesc(followingIds, pageable);

        // Convert dang DTO
        return postPage.map(post -> {
            PostResponse response = postMapper.toPostResponse(post);

            User user = userRepository.findById(post.getAuthorId()).
                    orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            response.setAuthor(UserResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .profilePic(user.getProfilePic())
                    .build());

            int totalLikes = postLikeRepository.countByPostId(post.getId());
            boolean likedByMe = postLikeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);

            response.setTotalLikes(totalLikes);
            response.setLikedByMe(likedByMe);
            return response;
        });
    }
}

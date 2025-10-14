package com.social.socialmedia.service;

import com.social.socialmedia.dto.response.FollowResponse;
import com.social.socialmedia.entity.User;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.mapper.FollowMapper;
import com.social.socialmedia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowMapper followMapper;

    @Autowired
    private NotificationService notificationService;

    public void follow(String targetId) {
        // Lấy user hiện tại từ jwt
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User follower = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        User target = userRepository.findById(targetId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Thêm nếu chưa tồn tại
        if (!follower.getFollowing().contains(targetId)) {
            follower.getFollowing().add(target.getId());
            target.getFollowers().add(follower.getId());

            userRepository.save(follower);
            userRepository.save(target);

            // Notification
            notificationService.createFollowNotification(
                    target.getId(), //Người nhận thông báo
                    follower.getId(), // Người gửi thông báo
                    follower.getFullName()
            );
        };
    }

    public void unfollow(String targetId) {
        // Lấy user hiện tại từ jwt
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User follower = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        User target = userRepository.findById(targetId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        follower.getFollowing().remove(target.getId());
        target.getFollowers().remove(follower.getId());

        userRepository.save(follower);
        userRepository.save(target);
    }

    public List<FollowResponse> getMyFollower() {
        // Lấy user hiện tại từ jwt
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User myUser = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userRepository.findAllById(myUser.getFollowers()).stream()
                .map(followMapper::toFollowResponse).toList();
    }

    public List<FollowResponse> getMyFollowing() {
        // Lấy user hiện tại từ jwt
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User myUser = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userRepository.findAllById(myUser.getFollowing()).stream()
                .map(followMapper::toFollowResponse).toList();
    }

    public List<FollowResponse> getFollowers(String userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userRepository.findAllById(user.getFollowers()).stream()
                .map(followMapper::toFollowResponse).toList();
    }

    public List<FollowResponse> getFollowing(String userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userRepository.findAllById(user.getFollowing()).stream()
                .map(followMapper::toFollowResponse).toList();
    }
}

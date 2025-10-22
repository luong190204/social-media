package com.social.socialmedia.service;

import com.social.socialmedia.configuration.SecurityUtils;
import com.social.socialmedia.dto.request.UserCreationRequest;
import com.social.socialmedia.dto.request.UserUpdateRequest;
import com.social.socialmedia.dto.response.UserResponse;
import com.social.socialmedia.entity.User;
import com.social.socialmedia.enums.Role;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.mapper.UserMapper;
import com.social.socialmedia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UserMapper userMapper;

    @Autowired
    CloudinaryService cloudinaryService;

    public UserResponse createUser (UserCreationRequest request) {

        if (userRepository.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);

        User user = userMapper.toUser(request);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Set role
        HashSet<String> roles = new HashSet<>();
        roles.add(Role.USER.name());

        user.setRoles(roles);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse).toList();
    }

    //@PostAuthorize("returnObject.username == authentication.name")
    public UserResponse getInfoUser(String id) {
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_FOUND)));
    }

    public UserResponse updateUser(UserUpdateRequest request) {
        var userName = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(userName).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse updateAvatar(MultipartFile file) {
        var userName = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(userName).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String imgUrl = cloudinaryService.uploadFile(file);

        user.setProfilePic(imgUrl);
        user.setUpdatedAt(LocalDateTime.now());

        return userMapper.toUserResponse(userRepository.save(user));
    }


    public UserResponse getMyInfo() {
        // get được user đang login hiện tại
        var context = SecurityContextHolder.getContext();

        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(
                () -> new AppException(ErrorCode.USER_FOUND)
        );

        return userMapper.toUserResponse(user);
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    public List<UserResponse> searchUsers(String username) {
        if (username == null || username.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<User> users = userRepository.findByUsernameContainingIgnoreCase(username);

        return users.stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    // Hàm search user trong messages
    public List<UserResponse> searchUsersMessage(String keyword) {
        String currentUserId = SecurityUtils.getCurrentUserId();

        User currentUser = userRepository.findById(currentUserId).orElseThrow(
                () -> new AppException(ErrorCode.USER_FOUND));

        List<String> followingIds = currentUser.getFollowing();
        if (followingIds == null || followingIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<User> matchUsers = userRepository.findByIdInAndFullNameContainingIgnoreCase(followingIds, keyword);

        return matchUsers.stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .profilePic(user.getProfilePic())
                        .build())
                .collect(Collectors.toList());
    }
}

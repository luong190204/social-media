package com.social.socialmedia.mapper;

import com.social.socialmedia.dto.request.UserCreationRequest;
import com.social.socialmedia.dto.request.UserUpdateRequest;
import com.social.socialmedia.dto.response.UserResponse;
import com.social.socialmedia.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    // Map từ request tạo user -> entity User
    User toUser(UserCreationRequest request);

    // Cần khai báo instance để dùng khi gọi mapper thủ công (nếu không inject qua Spring)
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    // Map từ entity User -> DTO trả về cho client.
    // Lưu ý: Đảm bảo map luôn field 'id' từ entity sang DTO để tránh trả về null.
    UserResponse toUserResponse(User user);

    // Cập nhật dữ liệu user từ request update (giữ nguyên các field không có trong request)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}

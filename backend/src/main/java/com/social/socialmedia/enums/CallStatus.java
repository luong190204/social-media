package com.social.socialmedia.enums;

public enum CallStatus {
    INITIATING,   // Đang khởi tạo
    RINGING,       // Đang đổ chuông
    ONGOING,     // Đã kết nối
    ENDED,         // Kết thúc bình thường
    MISSED,        // Bên kia không bắt máy
    REJECTED,       // Bị từ chối
    FAILED,       // Lỗi kỹ thuật
    CANCELLED     // Hủy bỏ (người gọi hủy trước khi nghe máy)
}

package com.social.socialmedia.enums;

/*
ACTIVE → hiển thị bình thường.

EDITED → user đã chỉnh sửa comment.

DELETED → xóa mềm (chỉ ẩn với người khác, DB vẫn lưu).

HIDDEN → bị ẩn do vi phạm (admin action).
*/

public enum CommentStatus {
    ACTIVE, EDITED, DELETED, HIDDEN
}

package com.social.socialmedia.enums;

/*
ACTIVE → hiển thị công khai.

DELETED → user xóa, nhưng vẫn giữ trong DB (soft delete).

HIDDEN → ẩn bài viết (có thể do user hoặc admin).
*/

public enum PostStatus {
    ACTIVE,
    HIDDEN,
    DELETED
}

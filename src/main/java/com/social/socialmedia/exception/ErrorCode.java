package com.social.socialmedia.exception;

public enum ErrorCode {
        UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Error"),
        USER_EXISTED(1001, "User existed"),
        USER_FOUND(1002, "User not found"),
        USERNAME_INVALID(1003, "UserName must be at least 3 characters"),
        PASSWORD_INVALID(1004, "Password must be at least 6 characters"),
        USER_NOT_EXISTED(1005, "User not existed"),
        UNAUTHENTICATED(1006, "Unauthenticated"),
        UNAUTHORIZED(1007, "You not have permission"),
        INVALID_DOB(1008, "your age must be at least {min}"),
        INVALID_KEY(1009, "Uncategorized error"),
    ;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    private int code;
    private String message;

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}

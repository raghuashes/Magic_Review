package com.magicreview.exception;

public class TenantAccessDeniedException extends RuntimeException {
    public TenantAccessDeniedException(String message) {
        super(message);
    }

    public TenantAccessDeniedException() {
        super("Access denied: You do not have permission to access this resource");
    }
}
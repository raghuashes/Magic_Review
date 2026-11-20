package com.magicreview.enums;

public enum Role {
    BUSINESS_OWNER,
    ADMIN;

    public static Role fromString(String role) {
        if (role == null) return BUSINESS_OWNER;
        try {
            return Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return BUSINESS_OWNER;
        }
    }
}
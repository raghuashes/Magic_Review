package com.magicreview.enums;

public enum EventType {
    PAGE_VIEW,
    DRAFT_GENERATED,
    GOOGLE_LINK_CLICKED;

    public static EventType fromString(String type) {
        if (type == null) {
            throw new IllegalArgumentException("Event type must not be null");
        }
        try {
            return EventType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                "Unsupported event type: " + type +
                ". Supported values: PAGE_VIEW, DRAFT_GENERATED, GOOGLE_LINK_CLICKED"
            );
        }
    }
}
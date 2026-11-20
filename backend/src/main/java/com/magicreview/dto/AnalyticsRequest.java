package com.magicreview.dto;

import com.magicreview.enums.EventType;
import jakarta.validation.constraints.NotNull;

public class AnalyticsRequest {
    @NotNull(message = "Event type is required")
    private EventType eventType;

    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }
}
package com.magicreview.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AnalyticsResponse {
    private long totalVisits;
    private long draftsGenerated;
    private long googleLinkClicks;

    private Map<String, Long> visitsByDay;
    private Map<String, Long> draftsByDay;
    private Map<String, Long> clicksByDay;

    private List<EventSummary> recentEvents;

    public AnalyticsResponse(long totalVisits, long draftsGenerated, long googleLinkClicks) {
        this.totalVisits = totalVisits;
        this.draftsGenerated = draftsGenerated;
        this.googleLinkClicks = googleLinkClicks;
    }

    public long getTotalVisits() { return totalVisits; }
    public void setTotalVisits(long totalVisits) { this.totalVisits = totalVisits; }

    public long getDraftsGenerated() { return draftsGenerated; }
    public void setDraftsGenerated(long draftsGenerated) { this.draftsGenerated = draftsGenerated; }

    public long getGoogleLinkClicks() { return googleLinkClicks; }
    public void setGoogleLinkClicks(long googleLinkClicks) { this.googleLinkClicks = googleLinkClicks; }

    public Map<String, Long> getVisitsByDay() { return visitsByDay; }
    public void setVisitsByDay(Map<String, Long> visitsByDay) { this.visitsByDay = visitsByDay; }

    public Map<String, Long> getDraftsByDay() { return draftsByDay; }
    public void setDraftsByDay(Map<String, Long> draftsByDay) { this.draftsByDay = draftsByDay; }

    public Map<String, Long> getClicksByDay() { return clicksByDay; }
    public void setClicksByDay(Map<String, Long> clicksByDay) { this.clicksByDay = clicksByDay; }

    public List<EventSummary> getRecentEvents() { return recentEvents; }
    public void setRecentEvents(List<EventSummary> recentEvents) { this.recentEvents = recentEvents; }

    public static class EventSummary {
        private LocalDateTime timestamp;
        private String eventType;

        public EventSummary(LocalDateTime timestamp, String eventType) {
            this.timestamp = timestamp;
            this.eventType = eventType;
        }

        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

        public String getEventType() { return eventType; }
        public void setEventType(String eventType) { this.eventType = eventType; }
    }
}
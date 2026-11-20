package com.magicreview.service;

import com.magicreview.dto.AnalyticsRequest;
import com.magicreview.dto.AnalyticsResponse;
import com.magicreview.entity.AnalyticsEvent;
import com.magicreview.enums.EventType;
import com.magicreview.exception.TenantAccessDeniedException;
import com.magicreview.repository.AnalyticsEventRepository;
import com.magicreview.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnalyticsService {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private AnalyticsEventRepository analyticsEventRepository;

    public void recordEvent(String slug, AnalyticsRequest request) {
        var storeOpt = storeRepository.findBySlug(slug);
        if (storeOpt.isEmpty() || !storeOpt.get().isActive()) {
            throw new TenantAccessDeniedException("Store not found or inactive");
        }

        AnalyticsEvent event = new AnalyticsEvent();
        event.setStoreId(storeOpt.get().getId());
        event.setEventType(request.getEventType());
        analyticsEventRepository.save(event);
    }

    public AnalyticsResponse getAnalytics(UUID ownerId, UUID storeId) {
        var storeOpt = storeRepository.findById(storeId);
        if (storeOpt.isEmpty()) {
            throw new TenantAccessDeniedException("Store not found");
        }

        if (!storeOpt.get().getOwnerId().equals(ownerId)) {
            throw new TenantAccessDeniedException("Access denied to this store");
        }

        UUID storeUuid = storeOpt.get().getId();

        long totalVisits = analyticsEventRepository.countByStoreIdAndEventType(storeUuid, EventType.PAGE_VIEW);
        long draftsGenerated = analyticsEventRepository.countByStoreIdAndEventType(storeUuid, EventType.DRAFT_GENERATED);
        long googleLinkClicks = analyticsEventRepository.countByStoreIdAndEventType(storeUuid, EventType.GOOGLE_LINK_CLICKED);

        AnalyticsResponse response = new AnalyticsResponse(totalVisits, draftsGenerated, googleLinkClicks);

        // Get last 30 days breakdown
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Map<String, Long> visitsByDay = new LinkedHashMap<>();
        Map<String, Long> draftsByDay = new LinkedHashMap<>();
        Map<String, Long> clicksByDay = new LinkedHashMap<>();

        // Initialize all days with 0
        for (int i = 29; i >= 0; i--) {
            String day = LocalDateTime.now().minusDays(i).format(formatter);
            visitsByDay.put(day, 0L);
            draftsByDay.put(day, 0L);
            clicksByDay.put(day, 0L);
        }

        // Fill in actual data
        List<AnalyticsEvent> recentEvents = analyticsEventRepository.findByStoreIdOrderByCreatedAtDesc(storeUuid);
        for (AnalyticsEvent event : recentEvents) {
            if (event.getCreatedAt().isAfter(thirtyDaysAgo)) {
                String day = event.getCreatedAt().format(formatter);
                switch (event.getEventType()) {
                    case PAGE_VIEW:
                        visitsByDay.merge(day, 1L, Long::sum);
                        break;
                    case DRAFT_GENERATED:
                        draftsByDay.merge(day, 1L, Long::sum);
                        break;
                    case GOOGLE_LINK_CLICKED:
                        clicksByDay.merge(day, 1L, Long::sum);
                        break;
                }
            }
        }

        response.setVisitsByDay(visitsByDay);
        response.setDraftsByDay(draftsByDay);
        response.setClicksByDay(clicksByDay);

        // Recent events (last 50)
        List<AnalyticsResponse.EventSummary> eventSummaries = recentEvents.stream()
                .limit(50)
                .map(e -> new AnalyticsResponse.EventSummary(e.getCreatedAt(), e.getEventType().name()))
                .collect(Collectors.toList());
        response.setRecentEvents(eventSummaries);

        return response;
    }
}
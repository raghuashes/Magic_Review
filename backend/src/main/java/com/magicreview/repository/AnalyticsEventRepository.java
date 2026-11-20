package com.magicreview.repository;

import com.magicreview.entity.AnalyticsEvent;
import com.magicreview.enums.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEvent, UUID> {
    List<AnalyticsEvent> findByStoreIdOrderByCreatedAtDesc(UUID storeId);

    List<AnalyticsEvent> findByStoreIdAndEventType(UUID storeId, EventType eventType);

    @Query("SELECT COUNT(e) FROM AnalyticsEvent e WHERE e.storeId = :storeId AND e.eventType = :eventType")
    long countByStoreIdAndEventType(UUID storeId, EventType eventType);

    @Query("SELECT COUNT(e) FROM AnalyticsEvent e WHERE e.storeId = :storeId AND e.eventType = :eventType AND e.createdAt >= :since")
    long countByStoreIdAndEventTypeSince(UUID storeId, EventType eventType, LocalDateTime since);

    long countByStoreId(UUID storeId);
}
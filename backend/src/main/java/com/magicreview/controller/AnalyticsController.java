package com.magicreview.controller;

import com.magicreview.dto.AnalyticsResponse;
import com.magicreview.entity.User;
import com.magicreview.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/stores")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/{id}/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics(@AuthenticationPrincipal User user,
                                                           @PathVariable UUID id) {
        return ResponseEntity.ok(analyticsService.getAnalytics(user.getId(), id));
    }
}
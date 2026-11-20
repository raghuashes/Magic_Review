package com.magicreview.controller;

import com.magicreview.dto.ReviewGenerationRequest;
import com.magicreview.dto.ReviewGenerationResponse;
import com.magicreview.dto.AnalyticsRequest;
import com.magicreview.dto.StoreResponse;
import com.magicreview.dto.CategoryResponse;
import com.magicreview.dto.AttributeResponse;
import com.magicreview.service.AiReviewService;
import com.magicreview.service.AnalyticsService;
import com.magicreview.service.StoreService;
import com.magicreview.entity.Store;
import com.magicreview.entity.StoreCategory;
import com.magicreview.entity.StoreAttribute;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/stores")
public class PublicController {

    @Autowired
    private StoreService storeService;

    @Autowired
    private AiReviewService aiReviewService;

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/{slug}")
    public ResponseEntity<PublicStoreResponse> getPublicStore(@PathVariable String slug) {
        var storeOpt = storeService.getStoreBySlugForPublic(slug);
        if (storeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Store store = storeOpt.get();
        List<CategoryResponse> categories = storeService.getCategoriesForPublic(store.getId());
        List<AttributeResponse> attributes = storeService.getAttributesForPublic(store.getId());

        return ResponseEntity.ok(new PublicStoreResponse(
                new StoreResponse(store),
                categories,
                attributes
        ));
    }

    @PostMapping("/{slug}/generate-review")
    public ResponseEntity<ReviewGenerationResponse> generateReview(@PathVariable String slug,
                                                                    @Valid @RequestBody ReviewGenerationRequest request) {
        return ResponseEntity.ok(aiReviewService.generateReview(slug, request));
    }

    @PostMapping("/{slug}/events")
    public ResponseEntity<Void> recordEvent(@PathVariable String slug,
                                             @Valid @RequestBody AnalyticsRequest request) {
        analyticsService.recordEvent(slug, request);
        return ResponseEntity.ok().build();
    }

    // Helper DTO for public store view
    public static class PublicStoreResponse {
        private StoreResponse store;
        private List<CategoryResponse> categories;
        private List<AttributeResponse> attributes;

        public PublicStoreResponse(StoreResponse store, List<CategoryResponse> categories, List<AttributeResponse> attributes) {
            this.store = store;
            this.categories = categories;
            this.attributes = attributes;
        }

        public StoreResponse getStore() { return store; }
        public void setStore(StoreResponse store) { this.store = store; }
        public List<CategoryResponse> getCategories() { return categories; }
        public void setCategories(List<CategoryResponse> categories) { this.categories = categories; }
        public List<AttributeResponse> getAttributes() { return attributes; }
        public void setAttributes(List<AttributeResponse> attributes) { this.attributes = attributes; }
    }
}
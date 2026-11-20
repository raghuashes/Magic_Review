package com.magicreview;

import com.magicreview.dto.ReviewGenerationRequest;
import com.magicreview.dto.ReviewGenerationResponse;
import com.magicreview.entity.Store;
import com.magicreview.entity.StoreCategory;
import com.magicreview.entity.StoreAttribute;
import com.magicreview.enums.LanguageStyle;
import com.magicreview.repository.StoreRepository;
import com.magicreview.repository.StoreCategoryRepository;
import com.magicreview.repository.StoreAttributeRepository;
import com.magicreview.service.AiReviewService;
import com.magicreview.service.StoreService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AiReviewServiceTest {

    @Autowired
    private AiReviewService aiReviewService;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private StoreCategoryRepository categoryRepository;

    @Autowired
    private StoreAttributeRepository attributeRepository;

    @Test
    void testGenerateReviewAllLanguageStyles() {
        // Create a test store
        Store store = new Store();
        store.setOwnerId(UUID.randomUUID());
        store.setName("Test Jewellers");
        store.setSlug("test-jewellers");
        store.setGoogleReviewUrl("https://google.com/review/test");
        store.setActive(true);
        store = storeRepository.save(store);

        // Create category
        StoreCategory category = new StoreCategory();
        category.setStoreId(store.getId());
        category.setName("Jewellery Quality");
        category.setActive(true);
        category = categoryRepository.save(category);

        // Create attributes
        StoreAttribute attr1 = new StoreAttribute();
        attr1.setStoreId(store.getId());
        attr1.setLabel("Helpful staff");
        attr1.setActive(true);

        StoreAttribute attr2 = new StoreAttribute();
        attr2.setStoreId(store.getId());
        attr2.setLabel("Clear pricing");
        attr2.setActive(true);

        List<StoreAttribute> attributes = attributeRepository.saveAll(List.of(attr1, attr2));

        // Test all three language styles
        for (LanguageStyle style : LanguageStyle.values()) {
            ReviewGenerationRequest request = new ReviewGenerationRequest();
            request.setCategoryId(category.getId());
            request.setAttributeIds(attributes.stream().map(StoreAttribute::getId).toList());
            request.setCustomerNote("Great experience!");
            request.setLanguageStyle(style);

            ReviewGenerationResponse response = aiReviewService.generateReview(store.getSlug(), request);

            assertNotNull(response.getReviewText(), "Review text should not be null for " + style);
            assertFalse(response.getReviewText().isBlank(), "Review text should not be empty for " + style);
            assertNotNull(response.getMode(), "Mode should not be null");

            // Verify no non-Latin characters
            assertTrue(isLatinOnly(response.getReviewText()),
                    "Review for " + style + " contains non-Latin characters: " + response.getReviewText());

            // Verify it mentions store name or category
            String text = response.getReviewText().toLowerCase();
            assertTrue(text.contains("test") || text.contains("jewell") || text.contains("quality"),
                    "Review should reference store/category: " + response.getReviewText());
        }
    }

    @Test
    void testGenerateReviewWithEmptyAttributes() {
        Store store = new Store();
        store.setOwnerId(UUID.randomUUID());
        store.setName("Test Salon");
        store.setSlug("test-salon");
        store.setGoogleReviewUrl("https://google.com/review/test");
        store.setActive(true);
        store = storeRepository.save(store);

        StoreCategory category = new StoreCategory();
        category.setStoreId(store.getId());
        category.setName("Haircut");
        category.setActive(true);
        category = categoryRepository.save(category);

        ReviewGenerationRequest request = new ReviewGenerationRequest();
        request.setCategoryId(category.getId());
        request.setAttributeIds(List.of());
        request.setCustomerNote("");
        request.setLanguageStyle(LanguageStyle.HINGLISH);

        ReviewGenerationResponse response = aiReviewService.generateReview(store.getSlug(), request);

        assertNotNull(response.getReviewText());
        assertFalse(response.getReviewText().isBlank());
        assertTrue(isLatinOnly(response.getReviewText()));
    }

    @Test
    void testDemoModeFallback() {
        // This test verifies demo mode works when GEMINI_API_KEY is not set
        // The test profile should not have GEMINI_API_KEY configured

        Store store = new Store();
        store.setOwnerId(UUID.randomUUID());
        store.setName("Demo Restaurant");
        store.setSlug("demo-restaurant");
        store.setGoogleReviewUrl("https://google.com/review/test");
        store.setActive(true);
        store = storeRepository.save(store);

        StoreCategory category = new StoreCategory();
        category.setStoreId(store.getId());
        category.setName("Food Quality");
        category.setActive(true);
        category = categoryRepository.save(category);

        StoreAttribute attr = new StoreAttribute();
        attr.setStoreId(store.getId());
        attr.setLabel("Tasty food");
        attr.setActive(true);
        attr = attributeRepository.save(attr);

        ReviewGenerationRequest request = new ReviewGenerationRequest();
        request.setCategoryId(category.getId());
        request.setAttributeIds(List.of(attr.getId()));
        request.setCustomerNote("Loved it!");
        request.setLanguageStyle(LanguageStyle.TELUGU_ENGLISH_MIX);

        ReviewGenerationResponse response = aiReviewService.generateReview(store.getSlug(), request);

        assertEquals("demo", response.getMode(), "Should be in demo mode when no API key");
        assertNotNull(response.getReviewText());
        assertTrue(isLatinOnly(response.getReviewText()));
    }

    private boolean isLatinOnly(String text) {
        // Check that all characters are in basic Latin range (ASCII printable + common punctuation)
        for (char c : text.toCharArray()) {
            // Allow ASCII letters, digits, spaces, and common punctuation
            if (c > 127 && c != 'é' && c != 'à' && c != 'ü' && c != 'ñ') {
                // Allow a few common accented chars that might appear in names
                return false;
            }
        }
        return true;
    }
}
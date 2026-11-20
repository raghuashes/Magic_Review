package com.magicreview.service;

import com.magicreview.dto.ReviewGenerationRequest;
import com.magicreview.dto.ReviewGenerationResponse;
import com.magicreview.entity.Store;
import com.magicreview.entity.StoreCategory;
import com.magicreview.entity.StoreAttribute;
import com.magicreview.enums.LanguageStyle;
import com.magicreview.exception.TenantAccessDeniedException;
import com.magicreview.integration.DemoReviewGenerator;
import com.magicreview.integration.GeminiApiClient;
import com.magicreview.repository.StoreRepository;
import com.magicreview.repository.StoreCategoryRepository;
import com.magicreview.repository.StoreAttributeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AiReviewService {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private StoreCategoryRepository categoryRepository;

    @Autowired
    private StoreAttributeRepository attributeRepository;

    @Autowired
    private GeminiApiClient geminiApiClient;

    @Autowired
    private DemoReviewGenerator demoReviewGenerator;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    public ReviewGenerationResponse generateReview(String slug, ReviewGenerationRequest request) {
        Store store = storeRepository.findBySlug(slug)
                .orElseThrow(() -> new TenantAccessDeniedException("Store not found"));

        if (!store.isActive()) {
            throw new TenantAccessDeniedException("Store is not active");
        }

        StoreCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new TenantAccessDeniedException("Category not found"));

        if (!category.getStoreId().equals(store.getId())) {
            throw new TenantAccessDeniedException("Category does not belong to this store");
        }

        if (!category.isActive()) {
            throw new TenantAccessDeniedException("Category is not active");
        }

        List<StoreAttribute> attributes = List.of();
        if (request.getAttributeIds() != null && !request.getAttributeIds().isEmpty()) {
            attributes = attributeRepository.findAllById(request.getAttributeIds());
            // Verify all attributes belong to this store
            for (StoreAttribute attr : attributes) {
                if (!attr.getStoreId().equals(store.getId())) {
                    throw new TenantAccessDeniedException("Attribute does not belong to this store");
                }
            }
        }

        String reviewText;
        String mode;

        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                reviewText = generateWithGemini(store, category, attributes, request);
                mode = "ai";
            } catch (Exception e) {
                // Fallback to demo mode on AI failure
                reviewText = demoReviewGenerator.generateReview(
                        store.getName(),
                        category.getName(),
                        attributes.stream().map(StoreAttribute::getLabel).collect(Collectors.toList()),
                        request.getCustomerNote(),
                        request.getLanguageStyle()
                );
                mode = "demo";
            }
        } else {
            reviewText = demoReviewGenerator.generateReview(
                    store.getName(),
                    category.getName(),
                    attributes.stream().map(StoreAttribute::getLabel).collect(Collectors.toList()),
                    request.getCustomerNote(),
                    request.getLanguageStyle()
            );
            mode = "demo";
        }

        return new ReviewGenerationResponse(reviewText, mode);
    }

    private String generateWithGemini(Store store, StoreCategory category,
                                       List<StoreAttribute> attributes, ReviewGenerationRequest request) {
        String attributesList = attributes.stream()
                .map(StoreAttribute::getLabel)
                .collect(Collectors.joining(", "));

        String customerNote = request.getCustomerNote() != null ? request.getCustomerNote() : "None";

        String prompt = buildPrompt(
                store.getName(),
                category.getName(),
                attributesList,
                customerNote,
                request.getLanguageStyle()
        );

        return geminiApiClient.generateReview(prompt);
    }

    private String buildPrompt(String storeName, String category, String attributes,
                                String customerNote, LanguageStyle languageStyle) {
        String languageInstruction;
        switch (languageStyle) {
            case ENGLISH:
                languageInstruction = "Write in natural, conversational English.";
                break;
            case TELUGU_ENGLISH_MIX:
                languageInstruction = "Write in Telugu + English mix (Telugu-English code-mixing). " +
                        "Use ONLY Roman/Latin script (English alphabet). " +
                        "DO NOT use Telugu Unicode characters. " +
                        "Example: 'Mee shop lo collection chala bagundhi, staff helpful ga unnaru.'";
                break;
            case HINGLISH:
                languageInstruction = "Write in Hindi + English mix (Hinglish). " +
                        "Use ONLY Roman/Latin script (English alphabet). " +
                        "DO NOT use Devanagari Unicode characters. " +
                        "Example: 'Aapki shop ka collection bahut achha hai, staff bhi helpful tha.'";
                break;
            default:
                languageInstruction = "Write in natural, conversational English.";
        }

        return String.format("""
                You are an expert customer review generator for local Indian businesses.
                Target Language Style: %s
                Business Name: %s
                Category: %s
                Attributes Selected: %s
                Customer Notes: %s

                RULES:
                1. Output ONLY the raw review text string in 1 to 3 short, natural, conversational sentences. Do NOT include quotes, intros, or explanations.
                2. %s
                3. Do NOT invent facts, purchases, fake star ratings, discounts, or employee names not mentioned in the inputs.
                4. The review must sound authentic and natural, like a real customer wrote it.
                """, languageStyle.name(), storeName, category, attributes, customerNote, languageInstruction);
    }

    public String getPublicReviewUrl(String slug) {
        return frontendBaseUrl + "/s/" + slug;
    }

    public String getQrCodeUrl(String slug) {
        return getPublicReviewUrl(slug);
    }
}
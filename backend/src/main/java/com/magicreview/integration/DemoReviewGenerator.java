package com.magicreview.integration;

import com.magicreview.enums.LanguageStyle;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

@Component
public class DemoReviewGenerator {

    private static final Random RANDOM = new Random();

    // Templates for each language style
    private static final String[] ENGLISH_TEMPLATES = {
            "I had a wonderful experience at {storeName}. The {category} was excellent and the staff was very helpful.",
            "Visited {storeName} recently and was impressed by their {category}. {attributes} made my visit memorable.",
            "{storeName} offers great {category}. I particularly liked {attributes}. Will definitely return!",
            "Amazing {category} at {storeName}! The {attributes} really stood out. Highly recommended.",
            "Great experience at {storeName}. Their {category} is top-notch and {attributes}. Five stars!"
    };

    private static final String[] TELUGU_ENGLISH_MIX_TEMPLATES = {
            "Mee {storeName} lo chala bagundhi experience. {category} chala baga undhi, staff kuda helpful ga unnaru.",
            "{storeName} ki vellanu, {category} chala baga undhi. {attributes} chala nachindi. Memu malli vellam.",
            "{storeName} lo {category} chala best. {attributes} chala bagundhi. Five stars ichi!",
            "Mee shop lo {category} ekkuva best. {attributes} chala impressive. Strong recommend chestunnanu.",
            "{storeName} experience chala super. {category} quality chala baga undhi, {attributes} kuda chala nachindi."
    };

    private static final String[] HINGLISH_TEMPLATES = {
            "Maine {storeName} visit kiya aur experience bahut acha raha. {category} excellent thi aur staff bhi helpful tha.",
            "{storeName} ka {category} bahut best hai. {attributes} mujhe bahut pasand aaya. Dobara jaunga!",
            "{storeName} mein {category} ki quality top class hai. {attributes} ne dil jeet liya. Highly recommended!",
            "Bahut badhiya experience tha {storeName} ka. {category} shandaar thi aur {attributes} bhi amazing the.",
            "{storeName} ka {category} sabse best hai. {attributes} ne impress kar diya. Poore 5 stars!"
    };

    public String generateReview(String storeName, String category, List<String> attributes,
                                 String customerNote, LanguageStyle languageStyle) {
        String[] templates;
        switch (languageStyle) {
            case ENGLISH:
                templates = ENGLISH_TEMPLATES;
                break;
            case TELUGU_ENGLISH_MIX:
                templates = TELUGU_ENGLISH_MIX_TEMPLATES;
                break;
            case HINGLISH:
                templates = HINGLISH_TEMPLATES;
                break;
            default:
                templates = ENGLISH_TEMPLATES;
        }

        String template = templates[RANDOM.nextInt(templates.length)];

        String attributesText = formatAttributes(attributes);
        String review = template
                .replace("{storeName}", storeName)
                .replace("{category}", category)
                .replace("{attributes}", attributesText);

        // Append customer note if provided
        if (customerNote != null && !customerNote.isBlank()) {
            review += " " + customerNote;
        }

        return review.trim();
    }

    private String formatAttributes(List<String> attributes) {
        if (attributes == null || attributes.isEmpty()) {
            return "everything";
        }
        if (attributes.size() == 1) {
            return attributes.get(0);
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < attributes.size(); i++) {
            if (i > 0) {
                if (i == attributes.size() - 1) {
                    sb.append(" and ");
                } else {
                    sb.append(", ");
                }
            }
            sb.append(attributes.get(i));
        }
        return sb.toString();
    }
}
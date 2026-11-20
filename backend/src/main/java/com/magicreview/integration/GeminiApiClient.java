package com.magicreview.integration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
public class GeminiApiClient {

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    @Autowired
    public GeminiApiClient(
            @Qualifier("geminiRestClient") RestClient restClient,
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.model}") String model) {
        this.restClient = restClient;
        this.apiKey = apiKey;
        this.model = model;
    }

    public String generateReview(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Gemini API key not configured");
        }

        try {
            var requestBody = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                    "generationConfig", Map.of(
                            "temperature", 0.7,
                            "maxOutputTokens", 200,
                            "topP", 0.9
                    )
            );

            String response = restClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/models/{model}:generateContent")
                            .queryParam("key", apiKey)
                            .build(model))
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            return extractTextFromResponse(response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate review via Gemini API: " + e.getMessage(), e);
        }
    }

    private String extractTextFromResponse(String jsonResponse) {
        try {
            // Parse the response to extract the generated text
            // Response format: {"candidates":[{"content":{"parts":[{"text":"..."}]}]}}
            int candidatesStart = jsonResponse.indexOf("\"candidates\"");
            if (candidatesStart == -1) {
                throw new IllegalStateException("Invalid response format: no candidates");
            }

            int textStart = jsonResponse.indexOf("\"text\":\"", candidatesStart);
            if (textStart == -1) {
                throw new IllegalStateException("Invalid response format: no text field");
            }
            textStart += 8; // length of "\"text\":\""

            int textEnd = jsonResponse.indexOf("\"", textStart);
            if (textEnd == -1) {
                throw new IllegalStateException("Invalid response format: unclosed text field");
            }

            String extracted = jsonResponse.substring(textStart, textEnd);
            // Unescape JSON string
            return extracted
                    .replace("\\n", "\n")
                    .replace("\\\"", "\"")
                    .replace("\\\\", "\\");
        } catch (Exception e) {
            throw new IllegalStateException("Failed to parse Gemini response: " + e.getMessage(), e);
        }
    }
}
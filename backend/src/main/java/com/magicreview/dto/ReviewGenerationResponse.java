package com.magicreview.dto;

public class ReviewGenerationResponse {
    private String reviewText;
    private String mode; // "ai" or "demo"

    public ReviewGenerationResponse(String reviewText, String mode) {
        this.reviewText = reviewText;
        this.mode = mode;
    }

    public String getReviewText() { return reviewText; }
    public void setReviewText(String reviewText) { this.reviewText = reviewText; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
}
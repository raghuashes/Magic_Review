package com.magicreview.dto;

import com.magicreview.entity.Store;
import com.magicreview.enums.LanguageStyle;

import java.util.UUID;

public class StoreResponse {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String googleReviewUrl;
    private boolean active;
    private LanguageStyle defaultLanguageStyle = LanguageStyle.TELUGU_ENGLISH_MIX;

    public StoreResponse(Store store) {
        this.id = store.getId();
        this.name = store.getName();
        this.slug = store.getSlug();
        this.description = store.getDescription();
        this.logoUrl = store.getLogoUrl();
        this.primaryColor = store.getPrimaryColor();
        this.secondaryColor = store.getSecondaryColor();
        this.googleReviewUrl = store.getGoogleReviewUrl();
        this.active = store.isActive();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }

    public String getSecondaryColor() { return secondaryColor; }
    public void setSecondaryColor(String secondaryColor) { this.secondaryColor = secondaryColor; }

    public String getGoogleReviewUrl() { return googleReviewUrl; }
    public void setGoogleReviewUrl(String googleReviewUrl) { this.googleReviewUrl = googleReviewUrl; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LanguageStyle getDefaultLanguageStyle() { return defaultLanguageStyle; }
    public void setDefaultLanguageStyle(LanguageStyle defaultLanguageStyle) { this.defaultLanguageStyle = defaultLanguageStyle; }
}
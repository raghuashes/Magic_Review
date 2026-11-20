package com.magicreview.dto;

import com.magicreview.enums.LanguageStyle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public class ReviewGenerationRequest {
    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    private List<UUID> attributeIds;

    @Size(max = 1000, message = "Customer note must not exceed 1000 characters")
    private String customerNote;

    @NotNull(message = "Language style is required")
    private LanguageStyle languageStyle;

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

    public List<UUID> getAttributeIds() { return attributeIds; }
    public void setAttributeIds(List<UUID> attributeIds) { this.attributeIds = attributeIds; }

    public String getCustomerNote() { return customerNote; }
    public void setCustomerNote(String customerNote) { this.customerNote = customerNote; }

    public LanguageStyle getLanguageStyle() { return languageStyle; }
    public void setLanguageStyle(LanguageStyle languageStyle) { this.languageStyle = languageStyle; }
}
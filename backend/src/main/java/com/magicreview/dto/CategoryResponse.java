package com.magicreview.dto;

import com.magicreview.entity.StoreCategory;
import java.util.UUID;

public class CategoryResponse {
    private UUID id;
    private String name;
    private boolean active;
    private int displayOrder;

    public CategoryResponse(StoreCategory category) {
        this.id = category.getId();
        this.name = category.getName();
        this.active = category.isActive();
        this.displayOrder = category.getDisplayOrder();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
}
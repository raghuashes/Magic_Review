package com.magicreview.dto;

import com.magicreview.entity.StoreAttribute;
import java.util.UUID;

public class AttributeResponse {
    private UUID id;
    private String label;
    private boolean active;
    private int displayOrder;

    public AttributeResponse(StoreAttribute attribute) {
        this.id = attribute.getId();
        this.label = attribute.getLabel();
        this.active = attribute.isActive();
        this.displayOrder = attribute.getDisplayOrder();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
}
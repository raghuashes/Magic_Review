package com.magicreview.service;

import com.magicreview.dto.CategoryRequest;
import com.magicreview.dto.CategoryResponse;
import com.magicreview.dto.AttributeRequest;
import com.magicreview.dto.AttributeResponse;
import com.magicreview.dto.StoreRequest;
import com.magicreview.dto.StoreResponse;
import com.magicreview.entity.Store;
import com.magicreview.entity.StoreCategory;
import com.magicreview.entity.StoreAttribute;
import com.magicreview.exception.TenantAccessDeniedException;
import com.magicreview.repository.StoreRepository;
import com.magicreview.repository.StoreCategoryRepository;
import com.magicreview.repository.StoreAttributeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class StoreService {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private StoreCategoryRepository categoryRepository;

    @Autowired
    private StoreAttributeRepository attributeRepository;

    // --- Store CRUD ---

    public List<StoreResponse> getStoresByOwner(UUID ownerId) {
        return storeRepository.findByOwnerId(ownerId).stream()
                .map(StoreResponse::new)
                .collect(Collectors.toList());
    }

    public StoreResponse createStore(UUID ownerId, StoreRequest request) {
        String slug = request.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = generateSlug(request.getName());
        }

        // Ensure uniqueness
        String originalSlug = slug;
        int counter = 1;
        while (storeRepository.existsBySlug(slug)) {
            slug = originalSlug + "-" + counter++;
        }

        Store store = new Store();
        store.setOwnerId(ownerId);
        store.setName(request.getName());
        store.setSlug(slug);
        store.setDescription(request.getDescription());
        store.setLogoUrl(request.getLogoUrl());
        store.setPrimaryColor(request.getPrimaryColor());
        store.setSecondaryColor(request.getSecondaryColor());
        store.setGoogleReviewUrl(request.getGoogleReviewUrl());
        store.setActive(request.getActive());

        Store saved = storeRepository.save(store);
        return new StoreResponse(saved);
    }

    public StoreResponse getStoreById(UUID ownerId, UUID storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new TenantAccessDeniedException("Store not found"));

        if (!store.getOwnerId().equals(ownerId)) {
            throw new TenantAccessDeniedException("Access denied to this store");
        }

        return new StoreResponse(store);
    }

    public StoreResponse updateStore(UUID ownerId, UUID storeId, StoreRequest request) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new TenantAccessDeniedException("Store not found"));

        if (!store.getOwnerId().equals(ownerId)) {
            throw new TenantAccessDeniedException("Access denied to this store");
        }

        if (request.getName() != null) store.setName(request.getName());
        if (request.getSlug() != null && !request.getSlug().equals(store.getSlug())) {
            if (storeRepository.existsBySlugAndIdNot(request.getSlug(), storeId)) {
                throw new IllegalArgumentException("Slug already in use");
            }
            store.setSlug(request.getSlug());
        }
        if (request.getDescription() != null) store.setDescription(request.getDescription());
        if (request.getLogoUrl() != null) store.setLogoUrl(request.getLogoUrl());
        if (request.getPrimaryColor() != null) store.setPrimaryColor(request.getPrimaryColor());
        if (request.getSecondaryColor() != null) store.setSecondaryColor(request.getSecondaryColor());
        if (request.getGoogleReviewUrl() != null) store.setGoogleReviewUrl(request.getGoogleReviewUrl());
        if (request.getActive() != null) store.setActive(request.getActive());

        Store saved = storeRepository.save(store);
        return new StoreResponse(saved);
    }

    public void deleteStore(UUID ownerId, UUID storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new TenantAccessDeniedException("Store not found"));

        if (!store.getOwnerId().equals(ownerId)) {
            throw new TenantAccessDeniedException("Access denied to this store");
        }

        storeRepository.delete(store);
    }

    // --- Categories ---

    public List<CategoryResponse> getCategories(UUID ownerId, UUID storeId) {
        verifyStoreOwnership(ownerId, storeId);
        return categoryRepository.findByStoreIdOrderByDisplayOrderAsc(storeId).stream()
                .map(CategoryResponse::new)
                .collect(Collectors.toList());
    }

    public CategoryResponse createCategory(UUID ownerId, UUID storeId, CategoryRequest request) {
        verifyStoreOwnership(ownerId, storeId);

        StoreCategory category = new StoreCategory();
        category.setStoreId(storeId);
        category.setName(request.getName());
        category.setActive(request.getActive());
        category.setDisplayOrder(request.getDisplayOrder());

        StoreCategory saved = categoryRepository.save(category);
        return new CategoryResponse(saved);
    }

    public CategoryResponse updateCategory(UUID ownerId, UUID storeId, UUID categoryId, CategoryRequest request) {
        verifyStoreOwnership(ownerId, storeId);

        StoreCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new TenantAccessDeniedException("Category not found"));

        if (!category.getStoreId().equals(storeId)) {
            throw new TenantAccessDeniedException("Category does not belong to this store");
        }

        if (request.getName() != null) category.setName(request.getName());
        if (request.getActive() != null) category.setActive(request.getActive());
        if (request.getDisplayOrder() != null) category.setDisplayOrder(request.getDisplayOrder());

        StoreCategory saved = categoryRepository.save(category);
        return new CategoryResponse(saved);
    }

    public void deleteCategory(UUID ownerId, UUID storeId, UUID categoryId) {
        verifyStoreOwnership(ownerId, storeId);

        StoreCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new TenantAccessDeniedException("Category not found"));

        if (!category.getStoreId().equals(storeId)) {
            throw new TenantAccessDeniedException("Category does not belong to this store");
        }

        categoryRepository.delete(category);
    }

    // --- Attributes ---

    public List<AttributeResponse> getAttributes(UUID ownerId, UUID storeId) {
        verifyStoreOwnership(ownerId, storeId);
        return attributeRepository.findByStoreIdOrderByDisplayOrderAsc(storeId).stream()
                .map(AttributeResponse::new)
                .collect(Collectors.toList());
    }

    public AttributeResponse createAttribute(UUID ownerId, UUID storeId, AttributeRequest request) {
        verifyStoreOwnership(ownerId, storeId);

        StoreAttribute attribute = new StoreAttribute();
        attribute.setStoreId(storeId);
        attribute.setLabel(request.getLabel());
        attribute.setActive(request.getActive());
        attribute.setDisplayOrder(request.getDisplayOrder());

        StoreAttribute saved = attributeRepository.save(attribute);
        return new AttributeResponse(saved);
    }

    public AttributeResponse updateAttribute(UUID ownerId, UUID storeId, UUID attributeId, AttributeRequest request) {
        verifyStoreOwnership(ownerId, storeId);

        StoreAttribute attribute = attributeRepository.findById(attributeId)
                .orElseThrow(() -> new TenantAccessDeniedException("Attribute not found"));

        if (!attribute.getStoreId().equals(storeId)) {
            throw new TenantAccessDeniedException("Attribute does not belong to this store");
        }

        if (request.getLabel() != null) attribute.setLabel(request.getLabel());
        if (request.getActive() != null) attribute.setActive(request.getActive());
        if (request.getDisplayOrder() != null) attribute.setDisplayOrder(request.getDisplayOrder());

        StoreAttribute saved = attributeRepository.save(attribute);
        return new AttributeResponse(saved);
    }

    public void deleteAttribute(UUID ownerId, UUID storeId, UUID attributeId) {
        verifyStoreOwnership(ownerId, storeId);

        StoreAttribute attribute = attributeRepository.findById(attributeId)
                .orElseThrow(() -> new TenantAccessDeniedException("Attribute not found"));

        if (!attribute.getStoreId().equals(storeId)) {
            throw new TenantAccessDeniedException("Attribute does not belong to this store");
        }

        attributeRepository.delete(attribute);
    }

    // --- Helpers ---

    private void verifyStoreOwnership(UUID ownerId, UUID storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new TenantAccessDeniedException("Store not found"));

        if (!store.getOwnerId().equals(ownerId)) {
            throw new TenantAccessDeniedException("Access denied to this store");
        }
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }

    // --- Public access methods (no auth check) ---

    public Optional<Store> getStoreBySlugForPublic(String slug) {
        return storeRepository.findBySlug(slug)
                .filter(Store::isActive);
    }

    public List<CategoryResponse> getCategoriesForPublic(UUID storeId) {
        return categoryRepository.findByStoreIdAndActiveTrueOrderByDisplayOrderAsc(storeId).stream()
                .map(CategoryResponse::new)
                .collect(Collectors.toList());
    }

    public List<AttributeResponse> getAttributesForPublic(UUID storeId) {
        return attributeRepository.findByStoreIdAndActiveTrueOrderByDisplayOrderAsc(storeId).stream()
                .map(AttributeResponse::new)
                .collect(Collectors.toList());
    }
}
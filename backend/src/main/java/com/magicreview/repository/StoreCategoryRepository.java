package com.magicreview.repository;

import com.magicreview.entity.StoreCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface StoreCategoryRepository extends JpaRepository<StoreCategory, UUID> {
    List<StoreCategory> findByStoreIdOrderByDisplayOrderAsc(UUID storeId);
    List<StoreCategory> findByStoreIdAndActiveTrueOrderByDisplayOrderAsc(UUID storeId);
}
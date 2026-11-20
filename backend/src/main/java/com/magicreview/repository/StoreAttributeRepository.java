package com.magicreview.repository;

import com.magicreview.entity.StoreAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface StoreAttributeRepository extends JpaRepository<StoreAttribute, UUID> {
    List<StoreAttribute> findByStoreIdOrderByDisplayOrderAsc(UUID storeId);
    List<StoreAttribute> findByStoreIdAndActiveTrueOrderByDisplayOrderAsc(UUID storeId);
    List<StoreAttribute> findAllById(Iterable<UUID> ids);
}
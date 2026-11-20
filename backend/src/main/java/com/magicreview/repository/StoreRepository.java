package com.magicreview.repository;

import com.magicreview.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoreRepository extends JpaRepository<Store, UUID> {
    Optional<Store> findBySlug(String slug);

    List<Store> findByOwnerId(UUID ownerId);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Store s WHERE s.slug = :slug AND s.id != :id")
    boolean existsBySlugAndIdNot(String slug, UUID id);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Store s WHERE s.slug = :slug")
    boolean existsBySlug(String slug);
}
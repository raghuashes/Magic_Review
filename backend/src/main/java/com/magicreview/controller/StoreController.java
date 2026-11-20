package com.magicreview.controller;

import com.magicreview.dto.CategoryRequest;
import com.magicreview.dto.CategoryResponse;
import com.magicreview.dto.AttributeRequest;
import com.magicreview.dto.AttributeResponse;
import com.magicreview.dto.StoreRequest;
import com.magicreview.dto.StoreResponse;
import com.magicreview.entity.User;
import com.magicreview.service.StoreService;
import com.magicreview.service.AiReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @Autowired
    private AiReviewService aiReviewService;

    // --- Store CRUD ---

    @GetMapping
    public ResponseEntity<List<StoreResponse>> getStores(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(storeService.getStoresByOwner(user.getId()));
    }

    @PostMapping
    public ResponseEntity<StoreResponse> createStore(@AuthenticationPrincipal User user,
                                                      @Valid @RequestBody StoreRequest request) {
        return ResponseEntity.ok(storeService.createStore(user.getId(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreResponse> getStore(@AuthenticationPrincipal User user,
                                                   @PathVariable UUID id) {
        return ResponseEntity.ok(storeService.getStoreById(user.getId(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoreResponse> updateStore(@AuthenticationPrincipal User user,
                                                      @PathVariable UUID id,
                                                      @Valid @RequestBody StoreRequest request) {
        return ResponseEntity.ok(storeService.updateStore(user.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@AuthenticationPrincipal User user,
                                             @PathVariable UUID id) {
        storeService.deleteStore(user.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/qr")
    public ResponseEntity<Resource> getQrCode(@AuthenticationPrincipal User user,
                                               @PathVariable UUID id) {
        StoreResponse store = storeService.getStoreById(user.getId(), id);
        String qrUrl = aiReviewService.getQrCodeUrl(store.getSlug());

        // Generate QR code using ZXing
        byte[] qrBytes = generateQrCode(qrUrl);

        ByteArrayResource resource = new ByteArrayResource(qrBytes);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=qr-" + store.getSlug() + ".png")
                .contentType(MediaType.IMAGE_PNG)
                .contentLength(qrBytes.length)
                .body(resource);
    }

    // --- Categories ---

    @GetMapping("/{id}/categories")
    public ResponseEntity<List<CategoryResponse>> getCategories(@AuthenticationPrincipal User user,
                                                                 @PathVariable UUID id) {
        return ResponseEntity.ok(storeService.getCategories(user.getId(), id));
    }

    @PostMapping("/{id}/categories")
    public ResponseEntity<CategoryResponse> createCategory(@AuthenticationPrincipal User user,
                                                            @PathVariable UUID id,
                                                            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(storeService.createCategory(user.getId(), id, request));
    }

    @PutMapping("/{id}/categories/{categoryId}")
    public ResponseEntity<CategoryResponse> updateCategory(@AuthenticationPrincipal User user,
                                                            @PathVariable UUID id,
                                                            @PathVariable UUID categoryId,
                                                            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(storeService.updateCategory(user.getId(), id, categoryId, request));
    }

    @DeleteMapping("/{id}/categories/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@AuthenticationPrincipal User user,
                                                @PathVariable UUID id,
                                                @PathVariable UUID categoryId) {
        storeService.deleteCategory(user.getId(), id, categoryId);
        return ResponseEntity.noContent().build();
    }

    // --- Attributes ---

    @GetMapping("/{id}/attributes")
    public ResponseEntity<List<AttributeResponse>> getAttributes(@AuthenticationPrincipal User user,
                                                                  @PathVariable UUID id) {
        return ResponseEntity.ok(storeService.getAttributes(user.getId(), id));
    }

    @PostMapping("/{id}/attributes")
    public ResponseEntity<AttributeResponse> createAttribute(@AuthenticationPrincipal User user,
                                                              @PathVariable UUID id,
                                                              @Valid @RequestBody AttributeRequest request) {
        return ResponseEntity.ok(storeService.createAttribute(user.getId(), id, request));
    }

    @PutMapping("/{id}/attributes/{attributeId}")
    public ResponseEntity<AttributeResponse> updateAttribute(@AuthenticationPrincipal User user,
                                                              @PathVariable UUID id,
                                                              @PathVariable UUID attributeId,
                                                              @Valid @RequestBody AttributeRequest request) {
        return ResponseEntity.ok(storeService.updateAttribute(user.getId(), id, attributeId, request));
    }

    @DeleteMapping("/{id}/attributes/{attributeId}")
    public ResponseEntity<Void> deleteAttribute(@AuthenticationPrincipal User user,
                                                 @PathVariable UUID id,
                                                 @PathVariable UUID attributeId) {
        storeService.deleteAttribute(user.getId(), id, attributeId);
        return ResponseEntity.noContent().build();
    }

    // --- QR Code Generation Helper ---
    private byte[] generateQrCode(String content) {
        try {
            com.google.zxing.Writer writer = new com.google.zxing.qrcode.QRCodeWriter();
            com.google.zxing.common.BitMatrix bitMatrix = writer.encode(
                    content,
                    com.google.zxing.BarcodeFormat.QR_CODE,
                    512, 512
            );

            // Convert to PNG bytes
            java.awt.image.BufferedImage image = new java.awt.image.BufferedImage(512, 512, java.awt.image.BufferedImage.TYPE_INT_RGB);
            for (int x = 0; x < 512; x++) {
                for (int y = 0; y < 512; y++) {
                    image.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
                }
            }

            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
            javax.imageio.ImageIO.write(image, "png", baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }
}
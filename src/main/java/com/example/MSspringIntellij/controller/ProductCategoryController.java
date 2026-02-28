package com.example.MSspringIntellij.controller;

import com.example.MSspringIntellij.model.ProductCategory;
import com.example.MSspringIntellij.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/product-categories")
public class ProductCategoryController {

    @Autowired
    private ProductCategoryService service;

    private final String UPLOAD_DIR = "uploads/";

    // READ: Get all categories
    @GetMapping
    public List<ProductCategory> getAll() {
        return service.findAll();
    }

    // CREATE: Upload category with image
    @PostMapping(value = "/upload", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ProductCategory> create(
            @RequestPart("pcat") ProductCategory pcat,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        if (file != null && !file.isEmpty()) {
            pcat.setPCatImage(saveFile(file));
        }

        pcat.setPCatId(null); // Ensure new ID generation
        return ResponseEntity.ok(service.save(pcat));
    }

    // UPDATE: Modify category and replace image if provided
    @PutMapping(value = "/upload/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ProductCategory> update(
            @PathVariable Integer id,
            @RequestPart("pcat") ProductCategory data,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        return service.findById(id).map(existing -> {
            existing.setPCatTitle(data.getPCatTitle());
            existing.setPCatTop(data.getPCatTop());

            if (file != null && !file.isEmpty()) {
                deleteFile(existing.getPCatImage()); // Clean up old image
                try {
                    existing.setPCatImage(saveFile(file));
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } // Save new image
            }
            return ResponseEntity.ok(service.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Remove record and file
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return service.findById(id).map(pcat -> {
            deleteFile(pcat.getPCatImage());
            service.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Helper Methods ---
    private String saveFile(MultipartFile file) throws IOException {
        String uniqueName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR);
        if (!Files.exists(path))
            Files.createDirectories(path);
        Files.copy(file.getInputStream(), path.resolve(uniqueName), StandardCopyOption.REPLACE_EXISTING);
        return uniqueName;
    }

    private void deleteFile(String filename) {
        if (filename != null) {
            try {
                Files.deleteIfExists(Paths.get(UPLOAD_DIR).resolve(filename));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
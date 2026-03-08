package com.example.MSspringIntellij.controller;

import com.example.MSspringIntellij.model.Manufacturer;
import com.example.MSspringIntellij.repository.ManufacturerRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/manufacturers")
public class ManufacturerController {

    @Autowired
    private ManufacturerRepository repository;

    private final Path rootLocation = Paths.get("uploads/manufacturers");

    // 1. CREATE (POST) - Supports file upload and data
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create Manufacturer with Image")
    public ResponseEntity<Manufacturer> create(
            @RequestParam("title") String title,
            @RequestParam("top") String top,
            @RequestParam("image") MultipartFile file) throws IOException {

        init(); // Ensure folder exists
        String fileName = saveFile(file);

        Manufacturer m = new Manufacturer();
        m.setManufacturerTitle(title);
        m.setManufacturerTop(top);
        m.setManufacturerImage(fileName);

        return ResponseEntity.ok(repository.save(m));
    }

    // 2. UPDATE (PUT) - Handles data and optional new file (cleans up old file)
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update Manufacturer and Replace Image")
    public ResponseEntity<Manufacturer> update(
            @PathVariable Integer id,
            @RequestParam("title") String title,
            @RequestParam("top") String top,
            @RequestParam(value = "image", required = false) MultipartFile file) {

        return repository.findById(id).map(existing -> {
            existing.setManufacturerTitle(title);
            existing.setManufacturerTop(top);

            if (file != null && !file.isEmpty()) {
                try {
                    // Delete the old file from disk to save space
                    deletePhysicalFile(existing.getManufacturerImage());
                    // Save the new file
                    String newFileName = saveFile(file);
                    existing.setManufacturerImage(newFileName);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to update file storage");
                }
            }
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. READ ALL
    @GetMapping
    public List<Manufacturer> getAll() {
        return repository.findAll();
    }

    // 5. SERVE IMAGE (For browser viewing)
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            }
            return ResponseEntity.notFound().build();
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // --- HELPER METHODS FOR PERFORMANCE & CLEANUP ---

    private void init() {
        try {
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory");
        }
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty())
            return null;
        init();
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), this.rootLocation.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }

    private void deletePhysicalFile(String fileName) {
        if (fileName != null && !fileName.isEmpty()) {
            try {
                Path fileToDelete = rootLocation.resolve(fileName);
                Files.deleteIfExists(fileToDelete);
            } catch (IOException e) {
                System.err.println("Error deleting file: " + fileName);
            }
        }
    }
}
package com.example.MSspringIntellij.controller;

import com.example.MSspringIntellij.model.Product;
import com.example.MSspringIntellij.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductRepository repository;

    @GetMapping
    public List<Product> getAll(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return repository.findByProductTitleContainingIgnoreCaseOrProductKeywordsContainingIgnoreCase(search,
                    search);
        }
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product product) {
        try {
            product.setDate(LocalDateTime.now()); // auto set current timestamp
            Product saved = repository.save(product);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Integer id, @RequestBody Product product) {
        return repository.findById(id).map(existing -> {
            // Preserve existing date if not provided
            if (product.getDate() == null)
                product.setDate(existing.getDate());

            // Update ID and save
            product.setProductId(id);
            Product updated = repository.save(product);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
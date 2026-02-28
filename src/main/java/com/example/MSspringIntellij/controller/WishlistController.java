package com.example.MSspringIntellij.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.MSspringIntellij.model.Wishlist;
import com.example.MSspringIntellij.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService service;

    @Autowired
    public WishlistController(WishlistService service) {
        this.service = service;
    }

    @GetMapping
    public List<Wishlist> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Wishlist> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Wishlist> create(@RequestBody Wishlist wishlist) {
        wishlist.setWishlistId(null);
        return ResponseEntity.ok(service.save(wishlist));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Wishlist> update(@PathVariable Integer id, @RequestBody Wishlist updatedData) {
        return service.findById(id)
                .map(existingWishlist -> {
                    // Update only the fields that are allowed to change
                    existingWishlist.setCustomerId(updatedData.getCustomerId());
                    existingWishlist.setProductId(updatedData.getProductId());

                    // Save the entity that already exists in the database
                    return ResponseEntity.ok(service.save(existingWishlist));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return service.findById(id)
                .map(w -> {
                    service.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

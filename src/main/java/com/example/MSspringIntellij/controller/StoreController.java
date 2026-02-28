package com.example.MSspringIntellij.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MSspringIntellij.model.Store;
import com.example.MSspringIntellij.service.StoreService;

@RestController
@RequestMapping("/api/stores")
public class StoreController {
    @Autowired
    private StoreService service;

    @GetMapping
    public List<Store> getAll() {
        return service.findAll();
    }

    @PostMapping
    public ResponseEntity<Store> create(@RequestBody Store store) {
        store.setStoreId(null);
        return ResponseEntity.ok(service.save(store));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Store> update(@PathVariable Integer id, @RequestBody Store data) {
        return service.findById(id).map(existing -> {
            existing.setStoreButton(data.getStoreButton());
            existing.setStoreDesc(data.getStoreDesc());
            existing.setStoreImage(data.getStoreImage());
            existing.setStoreTitle(data.getStoreTitle());
            existing.setStoreUrl(data.getStoreUrl());
            return ResponseEntity.ok(service.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
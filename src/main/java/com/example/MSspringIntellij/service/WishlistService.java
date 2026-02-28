package com.example.MSspringIntellij.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MSspringIntellij.model.Wishlist;
import com.example.MSspringIntellij.repository.WishlistRepository;

import jakarta.transaction.Transactional;

@Service
public class WishlistService {

    private final WishlistRepository repository;

    @Autowired
    public WishlistService(WishlistRepository repository) {
        this.repository = repository;
    }

    public List<Wishlist> findAll() {
        return repository.findAll();
    }

    @SuppressWarnings("null")
    public Optional<Wishlist> findById(Integer id) {
        return repository.findById(id);
    }

    @SuppressWarnings("null")
    public Wishlist save(Wishlist w) {
        return repository.save(w);
    }

    @SuppressWarnings("null")
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }

    @Transactional // This creates a "bubble" where all DB operations are coordinated
    public Wishlist updateWishlist(Wishlist wishlist) {
        return repository.save(wishlist);
    }
}

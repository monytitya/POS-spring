package com.example.MSspringIntellij.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.MSspringIntellij.model.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    // no need to implement save(); JpaRepository provides it
}
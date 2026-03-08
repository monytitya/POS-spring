package com.example.MSspringIntellij.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MSspringIntellij.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByProductTitleContainingIgnoreCaseOrProductKeywordsContainingIgnoreCase(String title,
            String keyword);

    List<Product> findByCatId(Integer catId);
}
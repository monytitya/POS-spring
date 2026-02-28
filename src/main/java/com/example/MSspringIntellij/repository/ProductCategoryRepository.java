package com.example.MSspringIntellij.repository;

import com.example.MSspringIntellij.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Integer> {
    // Standard CRUD methods (save, findAll, deleteById) are automatically provided
}
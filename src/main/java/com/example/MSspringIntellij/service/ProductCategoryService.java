package com.example.MSspringIntellij.service;

import com.example.MSspringIntellij.model.ProductCategory;
import com.example.MSspringIntellij.repository.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductCategoryService {

    @Autowired
    private ProductCategoryRepository repository;

    public List<ProductCategory> findAll() {
        return repository.findAll();
    }

    public Optional<ProductCategory> findById(Integer id) {
        return repository.findById(id);
    }

    public ProductCategory save(ProductCategory category) {
        return repository.save(category);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
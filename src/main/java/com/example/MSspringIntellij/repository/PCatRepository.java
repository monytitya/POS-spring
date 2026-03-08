package com.example.MSspringIntellij.repository;

import com.example.MSspringIntellij.model.ProductCategory; // Import Entity របស់អ្នក
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PCatRepository extends JpaRepository<ProductCategory, Integer> {

}
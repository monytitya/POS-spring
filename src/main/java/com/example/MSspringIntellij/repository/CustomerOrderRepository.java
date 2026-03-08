package com.example.MSspringIntellij.repository;

import com.example.MSspringIntellij.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Integer> {
    // Basic CRUD methods are already included by JpaRepository
}
package com.example.MSspringIntellij.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.MSspringIntellij.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}
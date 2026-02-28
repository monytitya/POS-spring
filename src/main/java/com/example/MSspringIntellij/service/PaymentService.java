package com.example.MSspringIntellij.service;

import java.util.List;
import java.util.Optional;

import com.example.MSspringIntellij.model.Payment;

public interface PaymentService {
    List<Payment> findAll();

    Optional<Payment> findById(Integer id);

    Payment save(Payment payment);

    void deleteById(Integer id);
}
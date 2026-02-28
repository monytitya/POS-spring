package com.example.MSspringIntellij.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MSspringIntellij.model.Payment;
import com.example.MSspringIntellij.repository.PaymentRepository;
import com.example.MSspringIntellij.service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository repo;

    @Autowired
    public PaymentServiceImpl(PaymentRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Payment> findAll() {
        return repo.findAll();
    }

    @Override
    public Optional<Payment> findById(Integer id) {
        return repo.findById(id);
    }

    @Override
    public Payment save(Payment payment) {
        return repo.save(payment);
    }

    @Override
    public void deleteById(Integer id) {
        repo.deleteById(id);
    }
}
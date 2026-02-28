package com.example.MSspringIntellij.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import jakarta.servlet.http.Part;

@Repository
public interface PCatRepository extends JpaRepository<Part, Integer> {
}
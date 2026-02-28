package com.example.MSspringIntellij.repository;

import com.example.MSspringIntellij.model.Term;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TermRepository extends JpaRepository<Term, Integer> {
}
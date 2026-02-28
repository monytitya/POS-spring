package com.example.MSspringIntellij.service;

import com.example.MSspringIntellij.model.Term;
import com.example.MSspringIntellij.repository.TermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TermService {
    private final TermRepository repository;

    @Autowired
    public TermService(TermRepository repository) {
        this.repository = repository;
    }

    public List<Term> findAll() {
        return repository.findAll();
    }

    public Optional<Term> findById(Integer id) {
        return repository.findById(id);
    }

    public Term save(Term term) {
        return repository.save(term);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
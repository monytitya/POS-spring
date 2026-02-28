package com.example.MSspringIntellij.controller;

import com.example.MSspringIntellij.model.Term;
import com.example.MSspringIntellij.service.TermService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/terms")
public class TermController {

    private final TermService service;

    @Autowired
    public TermController(TermService service) {
        this.service = service;
    }

    @GetMapping
    public List<Term> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Term> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Term> create(@RequestBody Term term) {
        term.setTermId(null); // Ensure creation mode
        return ResponseEntity.ok(service.save(term));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Term> update(@PathVariable Integer id, @RequestBody Term data) {
        return service.findById(id)
                .map(existing -> {
                    existing.setTermTitle(data.getTermTitle());
                    existing.setTermLink(data.getTermLink());
                    existing.setTermDesc(data.getTermDesc());
                    return ResponseEntity.ok(service.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return service.findById(id)
                .map(t -> {
                    service.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
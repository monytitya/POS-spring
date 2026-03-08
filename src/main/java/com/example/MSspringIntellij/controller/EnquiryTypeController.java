package com.example.MSspringIntellij.controller;

import com.example.MSspringIntellij.model.EnquiryType;
import com.example.MSspringIntellij.repository.EnquiryTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enquiry-types")
public class EnquiryTypeController {

    @Autowired
    private EnquiryTypeRepository enquiryTypeRepository;

    @GetMapping
    public List<EnquiryType> getAll() {
        return enquiryTypeRepository.findAll();
    }

    @PostMapping
    public EnquiryType createEnquiry(@RequestBody EnquiryType enquiryType) {
        return enquiryTypeRepository.save(enquiryType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnquiryType> updateEnquiry(@PathVariable Integer id, @RequestBody EnquiryType details) {
        EnquiryType enquiry = enquiryTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enquiry not found with id: " + id));

        enquiry.setEnquiryTitle(details.getEnquiryTitle());

        EnquiryType updatedEnquiry = enquiryTypeRepository.save(enquiry);
        return ResponseEntity.ok(updatedEnquiry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEnquiry(@PathVariable Integer id) {
        enquiryTypeRepository.deleteById(id);
        return ResponseEntity.ok("Enquiry deleted successfully!");
    }
}
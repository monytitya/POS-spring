// package com.example.MSspringIntellij.controller;

// import com.example.MSspringIntellij.model.BundleProductRelation;
// import com.example.MSspringIntellij.service.BundleProductRelationService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/bundle-product-relations")
// public class BundleProductRelationController {

// private final BundleProductRelationService service;

// @Autowired
// public BundleProductRelationController(BundleProductRelationService service)
// {
// this.service = service;
// }

// @GetMapping
// public List<BundleProductRelation> getAll() { return service.findAll(); }

// @GetMapping("/{id}")
// public ResponseEntity<BundleProductRelation> getById(@PathVariable Integer
// id) {
// return service.findById(id)
// .map(ResponseEntity::ok)
// .orElse(ResponseEntity.notFound().build());
// }

// @PostMapping
// public ResponseEntity<BundleProductRelation> create(@RequestBody
// BundleProductRelation obj) { return ResponseEntity.ok(service.save(obj)); }

// @PutMapping("/{id}")
// public ResponseEntity<BundleProductRelation> update(@PathVariable Integer id,
// @RequestBody BundleProductRelation obj) {
// return service.findById(id)
// .map(existing -> {
// obj.setRelId(id);
// return ResponseEntity.ok(service.save(obj));
// })
// .orElse(ResponseEntity.notFound().build());
// }

// @DeleteMapping("/{id}")
// public ResponseEntity<Void> delete(@PathVariable Integer id) {
// if (service.findById(id).isPresent()) {
// service.deleteById(id);
// return ResponseEntity.noContent().build();
// }
// return ResponseEntity.notFound().build();
// }
// }

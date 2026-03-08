package com.example.MSspringIntellij.service;

import com.example.MSspringIntellij.model.Admin;
import com.example.MSspringIntellij.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdminService {
    public Admin saveOnlyData(Admin admin) {
        return repository.save(admin);
    }

    @Autowired
    private AdminRepository repository;

    private final Path root = Paths.get("src/main/resources/static/uploads");

    public List<Admin> findAll() {
        return repository.findAll();
    }

    public Optional<Admin> findById(Integer id) {
        return repository.findById(id);
    }

    public Admin save(Admin admin, MultipartFile file) throws IOException {
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        if (file != null && !file.isEmpty()) {
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            admin.setAdminImage(filename);
        }
        return repository.save(admin);
    }

    public void deleteById(Integer id) {
        repository.findById(id).ifPresent(admin -> {
            try {
                if (admin.getAdminImage() != null) {
                    Files.deleteIfExists(this.root.resolve(admin.getAdminImage()));
                }
            } catch (IOException e) {
                System.err.println("Error deleting file: " + e.getMessage());
            }
            repository.deleteById(id);
        });
    }
}
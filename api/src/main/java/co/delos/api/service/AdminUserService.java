package co.delos.api.service;

import co.delos.api.model.AdminUser;
import co.delos.api.repository.AdminUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class AdminUserService {
    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserService(AdminUserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<AdminUser> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    public AdminUser createUser(String username, String rawPassword) {
        AdminUser user = new AdminUser();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setCreatedAt(Instant.now().toString());
        return repository.save(user);
    }

    public boolean verifyPassword(String rawPassword, String hash) {
        return passwordEncoder.matches(rawPassword, hash);
    }
}

package co.delos.api.controller;

import co.delos.api.dto.request.LoginRequest;
import co.delos.api.dto.response.ErrorResponse;
import co.delos.api.dto.response.LoginResponse;
import co.delos.api.security.JwtUtil;
import co.delos.api.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AdminUserService adminUserService;
    private final JwtUtil jwtUtil;

    public AuthController(AdminUserService adminUserService, JwtUtil jwtUtil) {
        this.adminUserService = adminUserService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        var userOpt = adminUserService.findByUsername(req.username());
        if (userOpt.isEmpty() || !adminUserService.verifyPassword(req.password(), userOpt.get().getPasswordHash())) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid credentials"));
        }
        String token = jwtUtil.generateToken(req.username());
        String expiresAt = jwtUtil.getExpiry(token).toString();
        return ResponseEntity.ok(new LoginResponse(token, expiresAt));
    }
}

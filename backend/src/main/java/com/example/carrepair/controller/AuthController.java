package com.example.carrepair.controller;

import com.example.carrepair.domain.UserRole;
import com.example.carrepair.dto.AuthResponse;
import com.example.carrepair.dto.LoginRequest;
import com.example.carrepair.dto.RegisterRequest;
import com.example.carrepair.dto.ForgotPasswordRequest;
import com.example.carrepair.dto.ForgotUserIdRequest;
import com.example.carrepair.service.UserService;
import com.example.carrepair.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        AuthResponse response = userService.forgotPassword(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/forgot-user-id")
    public ResponseEntity<AuthResponse> forgotUserId(@Valid @RequestBody ForgotUserIdRequest request) {
        AuthResponse response = userService.forgotUserId(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("valid", false);
                response.put("message", "Invalid authorization header");
                return ResponseEntity.badRequest().body(response);
            }
            
            String token = authHeader.substring(7); // "Bearer " 제거
            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);
            
            // 토큰 유효성 검증
            if (jwtUtil.validateToken(token, username)) {
                response.put("valid", true);
                response.put("userId", username);
                response.put("username", username);
                response.put("role", role);
                response.put("fullName", username); // 실제 사용자 이름이 있다면 여기서 가져와야 함
                return ResponseEntity.ok(response);
            } else {
                response.put("valid", false);
                response.put("message", "Invalid or expired token");
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            response.put("valid", false);
            response.put("message", "Token validation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/roles")
    public ResponseEntity<List<UserRoleInfo>> getAvailableRoles() {
        List<UserRoleInfo> roles = Arrays.stream(UserRole.values())
                .map(role -> new UserRoleInfo(role.name(), role.getDisplayName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }
    
    // 내부 클래스
    public static class UserRoleInfo {
        private String value;
        private String displayName;
        
        public UserRoleInfo(String value, String displayName) {
            this.value = value;
            this.displayName = displayName;
        }
        
        public String getValue() {
            return value;
        }
        
        public void setValue(String value) {
            this.value = value;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }
    }
} 
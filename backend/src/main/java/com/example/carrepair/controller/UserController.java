package com.example.carrepair.controller;

import com.example.carrepair.domain.User;
import com.example.carrepair.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<User>> getActiveUsers() {
        return ResponseEntity.ok(userService.getActiveUsers());
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(userService.getPendingUsers());
    }
    
    @PostMapping("/{userId}/approve")
    public ResponseEntity<Map<String, Object>> approveUser(@PathVariable Long userId) {
        boolean success = userService.approveUser(userId);
        Map<String, Object> response = new HashMap<>();
        if (success) {
            response.put("success", true);
            response.put("message", "사용자가 승인되었습니다");
        } else {
            response.put("success", false);
            response.put("message", "사용자 승인에 실패했습니다");
        }
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{userId}/suspend")
    public ResponseEntity<Map<String, Object>> suspendUser(@PathVariable Long userId) {
        boolean success = userService.suspendUser(userId);
        Map<String, Object> response = new HashMap<>();
        if (success) {
            response.put("success", true);
            response.put("message", "사용자가 정지되었습니다");
        } else {
            response.put("success", false);
            response.put("message", "사용자 정지에 실패했습니다");
        }
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long userId) {
        boolean success = userService.deleteUser(userId);
        Map<String, Object> response = new HashMap<>();
        if (success) {
            response.put("success", true);
            response.put("message", "사용자가 삭제되었습니다");
        } else {
            response.put("success", false);
            response.put("message", "사용자 삭제에 실패했습니다");
        }
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userService.getActiveUserCount());
        stats.put("pendingUsers", userService.getPendingUsers().size());
        return ResponseEntity.ok(stats);
    }
} 
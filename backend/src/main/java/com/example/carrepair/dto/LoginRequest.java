package com.example.carrepair.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    
    @NotBlank(message = "아이디는 필수입니다")
    private String userId;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;
    
    public LoginRequest() {}
    
    public LoginRequest(String userId, String password) {
        this.userId = userId;
        this.password = password;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
} 
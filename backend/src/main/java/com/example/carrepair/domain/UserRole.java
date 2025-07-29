package com.example.carrepair.domain;

public enum UserRole {
    ADMIN("시스템 관리자"),
    EMPLOYEE("직원"),
    PARTNER("비즈니스 파트너"),
    SUPPLIER("협력사");
    
    private final String displayName;
    
    UserRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
} 
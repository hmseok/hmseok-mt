package com.example.carrepair.domain;

public enum UserStatus {
    PENDING("승인 대기"),
    ACTIVE("활성"),
    SUSPENDED("정지"),
    DELETED("삭제");
    
    private final String displayName;
    
    UserStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
} 
package com.example.carrepair.repository;

import com.example.carrepair.domain.User;
import com.example.carrepair.domain.UserRole;
import com.example.carrepair.domain.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUserId(String userId);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUserIdAndEmail(String userId, String email);
    
    Optional<User> findByEmailAndFullName(String email, String fullName);
    
    boolean existsByUserId(String userId);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByStatus(UserStatus status);
    
    long countByStatus(UserStatus status);
    
    long countByRoleAndStatus(UserRole role, UserStatus status);
    
    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.status = 'ACTIVE'")
    List<User> findActiveUsers();
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.status = 'ACTIVE'")
    List<User> findActiveUsersByRole(@Param("role") UserRole role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.status = 'ACTIVE'")
    long countActiveUsersByRole(@Param("role") UserRole role);
} 
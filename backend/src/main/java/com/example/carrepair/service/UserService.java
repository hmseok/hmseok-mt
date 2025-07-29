package com.example.carrepair.service;

import com.example.carrepair.domain.User;
import com.example.carrepair.domain.UserRole;
import com.example.carrepair.domain.UserStatus;
import com.example.carrepair.dto.AuthResponse;
import com.example.carrepair.dto.LoginRequest;
import com.example.carrepair.dto.RegisterRequest;
import com.example.carrepair.repository.UserRepository;
import com.example.carrepair.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse register(RegisterRequest request) {
        // 사용자명 중복 확인
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse("이미 존재하는 사용자명입니다", false);
        }
        
        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse("이미 존재하는 이메일입니다", false);
        }
        
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        
        // 사용자 생성
        User user = new User(
            request.getUsername(),
            encodedPassword,
            request.getEmail(),
            request.getFullName(),
            request.getRole()
        );
        
        user.setPhoneNumber(request.getPhoneNumber());
        user.setStatus(UserStatus.PENDING); // 승인 대기 상태
        
        userRepository.save(user);
        
        return new AuthResponse("회원가입이 완료되었습니다. 관리자 승인을 기다려주세요.", true);
    }
    
    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        
        if (userOpt.isEmpty()) {
            return new AuthResponse("사용자명 또는 비밀번호가 올바르지 않습니다", false);
        }
        
        User user = userOpt.get();
        
        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse("사용자명 또는 비밀번호가 올바르지 않습니다", false);
        }
        
        // 계정 상태 확인
        if (!user.isActive()) {
            return new AuthResponse("비활성화된 계정입니다", false);
        }
        
        if (user.getStatus() != UserStatus.ACTIVE) {
            return new AuthResponse("승인되지 않은 계정입니다. 관리자에게 문의하세요", false);
        }
        
        // 마지막 로그인 시간 업데이트
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // JWT 토큰 생성
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getFullName());
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public List<User> getActiveUsers() {
        return userRepository.findActiveUsers();
    }
    
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }
    
    public List<User> getPendingUsers() {
        return userRepository.findByStatus(UserStatus.PENDING);
    }
    
    public boolean approveUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setStatus(UserStatus.ACTIVE);
            userRepository.save(user);
            return true;
        }
        return false;
    }
    
    public boolean suspendUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setStatus(UserStatus.SUSPENDED);
            userRepository.save(user);
            return true;
        }
        return false;
    }
    
    public boolean deleteUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setStatus(UserStatus.DELETED);
            user.setActive(false);
            userRepository.save(user);
            return true;
        }
        return false;
    }
    
    public long getActiveUserCount() {
        return userRepository.count();
    }
    
    public long getActiveUserCountByRole(UserRole role) {
        return userRepository.countActiveUsersByRole(role);
    }
} 
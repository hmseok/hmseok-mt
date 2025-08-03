package com.example.carrepair.service;

import com.example.carrepair.domain.User;
import com.example.carrepair.domain.UserRole;
import com.example.carrepair.domain.UserStatus;
import com.example.carrepair.dto.AuthResponse;
import com.example.carrepair.dto.LoginRequest;
import com.example.carrepair.dto.RegisterRequest;
import com.example.carrepair.dto.ForgotPasswordRequest;
import com.example.carrepair.dto.ForgotUserIdRequest;
import com.example.carrepair.repository.UserRepository;
import com.example.carrepair.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse register(RegisterRequest request) {
        try {
            // 아이디 중복 확인
            if (userRepository.existsByUserId(request.getUserId())) {
                return new AuthResponse("이미 존재하는 아이디입니다. 다른 아이디를 사용해주세요.", false);
            }
            
            // 이메일 중복 확인
            if (userRepository.existsByEmail(request.getEmail())) {
                return new AuthResponse("이미 존재하는 이메일입니다. 다른 이메일을 사용해주세요.", false);
            }
            
            // 아이디 길이 검증
            if (request.getUserId().length() < 5) {
                return new AuthResponse("아이디는 최소 5자리 이상이어야 합니다.", false);
            }
            
            // 비밀번호 복잡성 검증
            if (request.getPassword().length() < 8) {
                return new AuthResponse("비밀번호는 최소 8자리 이상이어야 합니다.", false);
            }
            
            // 비밀번호에 영문, 숫자, 특수문자 포함 여부 확인
            boolean hasLetter = request.getPassword().matches(".*[a-zA-Z].*");
            boolean hasDigit = request.getPassword().matches(".*\\d.*");
            boolean hasSpecial = request.getPassword().matches(".*[!@#$%^&*(),.?\":{}|<>].*");
            
            if (!hasLetter || !hasDigit || !hasSpecial) {
                return new AuthResponse("비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다.", false);
            }
            
            // 이메일 형식 검증
            if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                return new AuthResponse("올바른 이메일 형식을 입력해주세요.", false);
            }
            
            // 전화번호 형식 검증 (선택사항)
            if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
                if (!request.getPhoneNumber().matches("^01[0-9]-[0-9]{3,4}-[0-9]{4}$")) {
                    return new AuthResponse("올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)", false);
                }
            }
            
            // 비밀번호 암호화
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            
            // 사용자 생성
            User user = new User(
                request.getUserId(),
                encodedPassword,
                request.getEmail(),
                request.getFullName(),
                request.getRole()
            );
            
            user.setPhoneNumber(request.getPhoneNumber());
            user.setStatus(UserStatus.PENDING); // 승인 대기 상태
            
            userRepository.save(user);
            
            return new AuthResponse("회원가입이 완료되었습니다. 관리자 승인을 기다려주세요.", true);
            
        } catch (Exception e) {
            // 데이터베이스 오류 등 예외 처리
            return new AuthResponse("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", false);
        }
    }
    
    public AuthResponse login(LoginRequest request) {
        try {
            Optional<User> userOpt = userRepository.findByUserId(request.getUserId());
            
            if (userOpt.isEmpty()) {
                return new AuthResponse("아이디 또는 비밀번호가 올바르지 않습니다", false);
            }
            
            User user = userOpt.get();
            
            // 비밀번호 확인
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return new AuthResponse("아이디 또는 비밀번호가 올바르지 않습니다", false);
            }
            
            // 계정 상태 확인 (개발 환경에서는 주석 처리)
            // if (!user.isActive()) {
            //     return new AuthResponse("비활성화된 계정입니다", false);
            // }
            
            // 개발 환경에서는 상태 확인을 건너뜀
            // if (user.getStatus() != UserStatus.ACTIVE) {
            //     return new AuthResponse("승인되지 않은 계정입니다. 관리자에게 문의하세요", false);
            // }
            
            // 마지막 로그인 시간 업데이트
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // JWT 토큰 생성
            String token = jwtUtil.generateToken(user.getUserId(), user.getRole().name());
            
            return new AuthResponse(token, user.getUserId(), user.getRole().name(), user.getFullName());
            
        } catch (Exception e) {
            return new AuthResponse("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", false);
        }
    }
    
    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        try {
            // 사용자명과 이메일로 사용자 찾기
            Optional<User> userOpt = userRepository.findByUserIdAndEmail(request.getUsername(), request.getEmail());
            
            if (userOpt.isEmpty()) {
                return new AuthResponse("일치하는 사용자 정보를 찾을 수 없습니다", false);
            }
            
            User user = userOpt.get();
            
            // 계정 상태 확인
            if (!user.isActive()) {
                return new AuthResponse("비활성화된 계정입니다", false);
            }
            
            // 임시 비밀번호 생성 (8자리 영문+숫자)
            String tempPassword = generateTempPassword();
            String encodedPassword = passwordEncoder.encode(tempPassword);
            
            // 비밀번호 업데이트
            user.setPassword(encodedPassword);
            userRepository.save(user);
            
            // TODO: 실제 이메일 발송 기능 구현
            // 현재는 콘솔에 출력
            System.out.println("임시 비밀번호: " + tempPassword);
            System.out.println("사용자: " + user.getUserId());
            System.out.println("이메일: " + user.getEmail());
            
            return new AuthResponse("임시 비밀번호가 생성되었습니다. 이메일을 확인해주세요.", true);
            
        } catch (Exception e) {
            return new AuthResponse("비밀번호 찾기 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", false);
        }
    }
    
    public AuthResponse forgotUserId(ForgotUserIdRequest request) {
        try {
            // 이메일과 이름으로 사용자 찾기
            Optional<User> userOpt = userRepository.findByEmailAndFullName(request.getEmail(), request.getFullName());
            
            if (userOpt.isEmpty()) {
                return new AuthResponse("일치하는 사용자 정보를 찾을 수 없습니다", false);
            }
            
            User user = userOpt.get();
            
            // 계정 상태 확인
            if (!user.isActive()) {
                return new AuthResponse("비활성화된 계정입니다", false);
            }
            
            // TODO: 실제 이메일 발송 기능 구현
            // 현재는 콘솔에 출력
            System.out.println("찾은 아이디: " + user.getUserId());
            System.out.println("사용자: " + user.getFullName());
            System.out.println("이메일: " + user.getEmail());
            
            return new AuthResponse("아이디가 이메일로 발송되었습니다. 이메일을 확인해주세요.", true);
            
        } catch (Exception e) {
            return new AuthResponse("아이디 찾기 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", false);
        }
    }
    
    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return sb.toString();
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
            userRepository.delete(userOpt.get());
            return true;
        }
        return false;
    }
    
    public long getActiveUserCount() {
        return userRepository.countByStatus(UserStatus.ACTIVE);
    }
    
    public long getActiveUserCountByRole(UserRole role) {
        return userRepository.countByRoleAndStatus(role, UserStatus.ACTIVE);
    }
} 
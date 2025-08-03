package com.example.carrepair.service;

import com.example.carrepair.domain.DevelopmentLog;
import com.example.carrepair.repository.DevelopmentLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DevelopmentLogService {
    
    @Autowired
    private DevelopmentLogRepository developmentLogRepository;
    
    // 모든 개발 로그 조회 (최신순)
    public List<DevelopmentLog> getAllLogs() {
        return developmentLogRepository.findAllByOrderByDateDesc();
    }
    
    // ID로 개발 로그 조회
    public Optional<DevelopmentLog> getLogById(Long id) {
        return developmentLogRepository.findById(id);
    }
    
    // 개발 로그 생성
    public DevelopmentLog createLog(DevelopmentLog log) {
        return developmentLogRepository.save(log);
    }
    
    // 개발 로그 수정
    public DevelopmentLog updateLog(Long id, DevelopmentLog logDetails) {
        Optional<DevelopmentLog> optionalLog = developmentLogRepository.findById(id);
        if (optionalLog.isPresent()) {
            DevelopmentLog existingLog = optionalLog.get();
            existingLog.setTitle(logDetails.getTitle());
            existingLog.setContent(logDetails.getContent());
            existingLog.setCategory(logDetails.getCategory());
            existingLog.setStatus(logDetails.getStatus());
            existingLog.setAuthor(logDetails.getAuthor());
            existingLog.setDate(logDetails.getDate());
            return developmentLogRepository.save(existingLog);
        }
        return null;
    }
    
    // 개발 로그 삭제
    public boolean deleteLog(Long id) {
        Optional<DevelopmentLog> optionalLog = developmentLogRepository.findById(id);
        if (optionalLog.isPresent()) {
            developmentLogRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // 카테고리별 로그 조회
    public List<DevelopmentLog> getLogsByCategory(String category) {
        return developmentLogRepository.findByCategoryOrderByDateDesc(category);
    }
    
    // 상태별 로그 조회
    public List<DevelopmentLog> getLogsByStatus(String status) {
        return developmentLogRepository.findByStatusOrderByDateDesc(status);
    }
    
    // 작성자별 로그 조회
    public List<DevelopmentLog> getLogsByAuthor(String author) {
        return developmentLogRepository.findByAuthorOrderByDateDesc(author);
    }
    
    // 날짜 범위로 로그 조회
    public List<DevelopmentLog> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return developmentLogRepository.findByDateBetweenOrderByDateDesc(startDate, endDate);
    }
    
    // 키워드 검색
    public List<DevelopmentLog> searchLogs(String keyword) {
        return developmentLogRepository.findByTitleContainingOrContentContainingOrderByDateDesc(keyword);
    }
    
    // 최근 N개 로그 조회
    public List<DevelopmentLog> getRecentLogs(int limit) {
        return developmentLogRepository.findTopNByOrderByDateDesc(limit);
    }
    
    // 통계 정보
    public long getTotalLogs() {
        return developmentLogRepository.count();
    }
    
    // 카테고리별 통계
    public long getLogsCountByCategory(String category) {
        return developmentLogRepository.findByCategoryOrderByDateDesc(category).size();
    }
    
    // 상태별 통계
    public long getLogsCountByStatus(String status) {
        return developmentLogRepository.findByStatusOrderByDateDesc(status).size();
    }
} 
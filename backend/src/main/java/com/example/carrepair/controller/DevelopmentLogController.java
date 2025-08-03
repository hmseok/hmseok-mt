package com.example.carrepair.controller;

import com.example.carrepair.domain.DevelopmentLog;
import com.example.carrepair.service.DevelopmentLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/development-logs")
public class DevelopmentLogController {
    
    @Autowired
    private DevelopmentLogService developmentLogService;
    
    // 모든 개발 로그 조회
    @GetMapping
    public ResponseEntity<List<DevelopmentLog>> getAllLogs() {
        List<DevelopmentLog> logs = developmentLogService.getAllLogs();
        return ResponseEntity.ok(logs);
    }
    
    // ID로 개발 로그 조회
    @GetMapping("/{id}")
    public ResponseEntity<DevelopmentLog> getLogById(@PathVariable Long id) {
        return developmentLogService.getLogById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // 개발 로그 생성
    @PostMapping
    public ResponseEntity<DevelopmentLog> createLog(@RequestBody DevelopmentLog log) {
        DevelopmentLog createdLog = developmentLogService.createLog(log);
        return ResponseEntity.ok(createdLog);
    }
    
    // 개발 로그 수정
    @PutMapping("/{id}")
    public ResponseEntity<DevelopmentLog> updateLog(@PathVariable Long id, @RequestBody DevelopmentLog logDetails) {
        DevelopmentLog updatedLog = developmentLogService.updateLog(id, logDetails);
        if (updatedLog != null) {
            return ResponseEntity.ok(updatedLog);
        }
        return ResponseEntity.notFound().build();
    }
    
    // 개발 로그 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteLog(@PathVariable Long id) {
        boolean deleted = developmentLogService.deleteLog(id);
        Map<String, String> response = new HashMap<>();
        if (deleted) {
            response.put("message", "개발 로그가 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "개발 로그를 찾을 수 없습니다.");
            return ResponseEntity.notFound().build();
        }
    }
    
    // 카테고리별 로그 조회
    @GetMapping("/category/{category}")
    public ResponseEntity<List<DevelopmentLog>> getLogsByCategory(@PathVariable String category) {
        List<DevelopmentLog> logs = developmentLogService.getLogsByCategory(category);
        return ResponseEntity.ok(logs);
    }
    
    // 상태별 로그 조회
    @GetMapping("/status/{status}")
    public ResponseEntity<List<DevelopmentLog>> getLogsByStatus(@PathVariable String status) {
        List<DevelopmentLog> logs = developmentLogService.getLogsByStatus(status);
        return ResponseEntity.ok(logs);
    }
    
    // 작성자별 로그 조회
    @GetMapping("/author/{author}")
    public ResponseEntity<List<DevelopmentLog>> getLogsByAuthor(@PathVariable String author) {
        List<DevelopmentLog> logs = developmentLogService.getLogsByAuthor(author);
        return ResponseEntity.ok(logs);
    }
    
    // 날짜 범위로 로그 조회
    @GetMapping("/date-range")
    public ResponseEntity<List<DevelopmentLog>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<DevelopmentLog> logs = developmentLogService.getLogsByDateRange(startDate, endDate);
        return ResponseEntity.ok(logs);
    }
    
    // 키워드 검색
    @GetMapping("/search")
    public ResponseEntity<List<DevelopmentLog>> searchLogs(@RequestParam String keyword) {
        List<DevelopmentLog> logs = developmentLogService.searchLogs(keyword);
        return ResponseEntity.ok(logs);
    }
    
    // 최근 N개 로그 조회
    @GetMapping("/recent")
    public ResponseEntity<List<DevelopmentLog>> getRecentLogs(@RequestParam(defaultValue = "10") int limit) {
        List<DevelopmentLog> logs = developmentLogService.getRecentLogs(limit);
        return ResponseEntity.ok(logs);
    }
    
    // 통계 정보
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLogs", developmentLogService.getTotalLogs());
        stats.put("completedLogs", developmentLogService.getLogsCountByStatus("완료"));
        stats.put("inProgressLogs", developmentLogService.getLogsCountByStatus("진행중"));
        stats.put("plannedLogs", developmentLogService.getLogsCountByStatus("계획"));
        return ResponseEntity.ok(stats);
    }
} 
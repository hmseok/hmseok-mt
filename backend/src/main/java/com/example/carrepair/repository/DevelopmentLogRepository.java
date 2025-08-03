package com.example.carrepair.repository;

import com.example.carrepair.domain.DevelopmentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DevelopmentLogRepository extends JpaRepository<DevelopmentLog, Long> {
    
    // 날짜별로 정렬된 모든 로그 조회
    List<DevelopmentLog> findAllByOrderByDateDesc();
    
    // 카테고리별 로그 조회
    List<DevelopmentLog> findByCategoryOrderByDateDesc(String category);
    
    // 상태별 로그 조회
    List<DevelopmentLog> findByStatusOrderByDateDesc(String status);
    
    // 작성자별 로그 조회
    List<DevelopmentLog> findByAuthorOrderByDateDesc(String author);
    
    // 날짜 범위로 로그 조회
    @Query("SELECT d FROM DevelopmentLog d WHERE d.date BETWEEN :startDate AND :endDate ORDER BY d.date DESC")
    List<DevelopmentLog> findByDateBetweenOrderByDateDesc(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // 제목이나 내용에 키워드가 포함된 로그 조회
    @Query("SELECT d FROM DevelopmentLog d WHERE d.title LIKE %:keyword% OR d.content LIKE %:keyword% ORDER BY d.date DESC")
    List<DevelopmentLog> findByTitleContainingOrContentContainingOrderByDateDesc(@Param("keyword") String keyword);
    
    // 최근 N개 로그 조회
    @Query("SELECT d FROM DevelopmentLog d ORDER BY d.date DESC")
    List<DevelopmentLog> findTopNByOrderByDateDesc(int limit);
} 
package com.example.carrepair.controller;

import com.example.carrepair.domain.Car;
import com.example.carrepair.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/excel")
@CrossOrigin(origins = "http://localhost:3000")
public class ExcelController {
    
    @Autowired
    private ExcelService excelService;
    
    @PostMapping("/upload-cars")
    public ResponseEntity<?> uploadCarExcel(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("파일이 비어있습니다.");
            }
            
            if (!file.getOriginalFilename().endsWith(".xlsx") && !file.getOriginalFilename().endsWith(".xls")) {
                return ResponseEntity.badRequest().body("엑셀 파일만 업로드 가능합니다.");
            }
            
            List<Car> cars = excelService.processCarExcel(file);
            
            return ResponseEntity.ok(Map.of(
                "message", "엑셀 파일 업로드 성공",
                "uploadedCount", cars.size(),
                "cars", cars
            ));
            
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("파일 처리 중 오류가 발생했습니다: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("업로드 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @GetMapping("/template/cars")
    public ResponseEntity<?> downloadCarTemplate() {
        // 엑셀 템플릿 다운로드 기능 (선택사항)
        return ResponseEntity.ok(Map.of(
            "message", "차량 정보 엑셀 템플릿",
            "columns", List.of("고객명", "차량번호", "차량모델", "연도"),
            "example", List.of("홍길동", "12가 3456", "그랜저", "2020")
        ));
    }
} 
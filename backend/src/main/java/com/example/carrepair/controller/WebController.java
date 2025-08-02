package com.example.carrepair.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    
    // SPA 라우팅을 위한 설정
    // API 경로가 아닌 모든 경로를 index.html로 리다이렉트
    @GetMapping(value = {"/", "/login", "/register", "/forgot-password", "/forgot-user-id", 
                         "/customers", "/vehicle-info", "/accidents", "/estimates", 
                         "/repairs", "/accounting", "/my-schedule", "/user-management"})
    public String forward() {
        return "forward:/index.html";
    }
} 
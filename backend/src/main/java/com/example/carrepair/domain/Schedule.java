package com.example.carrepair.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String type;
    private Long relatedId;
    private String relatedPath;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String assignedTo;
    private String priority;
} 
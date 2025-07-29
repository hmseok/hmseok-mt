package com.example.carrepair.domain;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Date;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Accounting {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date date;
    private String type; // "수입" 또는 "지출"
    private Integer amount;
    private String description;

    @ManyToOne
    @JoinColumn(name = "accident_id")
    private Accident accident; // 관련 사고가 있을 경우
} 
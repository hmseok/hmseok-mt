package com.example.carrepair.repository;

import com.example.carrepair.domain.Estimate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstimateRepository extends JpaRepository<Estimate, Long> {
} 
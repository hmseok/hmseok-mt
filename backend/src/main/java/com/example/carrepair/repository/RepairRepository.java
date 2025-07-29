package com.example.carrepair.repository;

import com.example.carrepair.domain.Repair;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepairRepository extends JpaRepository<Repair, Long> {
} 
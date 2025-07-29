package com.example.carrepair.repository;

import com.example.carrepair.domain.Accident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccidentRepository extends JpaRepository<Accident, Long> {
} 
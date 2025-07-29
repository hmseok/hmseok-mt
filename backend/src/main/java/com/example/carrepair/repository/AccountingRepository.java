package com.example.carrepair.repository;

import com.example.carrepair.domain.Accounting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountingRepository extends JpaRepository<Accounting, Long> {
} 
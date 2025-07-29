package com.example.carrepair.repository;

import com.example.carrepair.domain.Car;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository extends JpaRepository<Car, Long> {
} 
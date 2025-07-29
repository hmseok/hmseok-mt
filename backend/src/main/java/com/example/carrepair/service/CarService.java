package com.example.carrepair.service;

import com.example.carrepair.domain.Car;
import com.example.carrepair.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {
    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public List<Car> findAll() {
        return carRepository.findAll();
    }

    public Car save(Car car) {
        return carRepository.save(car);
    }

    public Car findById(Long id) {
        return carRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        carRepository.deleteById(id);
    }
} 
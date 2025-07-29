package com.example.carrepair.controller;

import com.example.carrepair.domain.Car;
import com.example.carrepair.service.CarService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {
    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public List<Car> getAll() {
        return carService.findAll();
    }

    @PostMapping
    public Car create(@RequestBody Car car) {
        return carService.save(car);
    }

    @GetMapping("/{id}")
    public Car getById(@PathVariable Long id) {
        return carService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        carService.deleteById(id);
    }
} 
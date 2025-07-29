package com.example.carrepair.controller;

import com.example.carrepair.domain.Estimate;
import com.example.carrepair.service.EstimateService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estimates")
public class EstimateController {
    private final EstimateService estimateService;

    public EstimateController(EstimateService estimateService) {
        this.estimateService = estimateService;
    }

    @GetMapping
    public List<Estimate> getAll() {
        return estimateService.findAll();
    }

    @PostMapping
    public Estimate create(@RequestBody Estimate estimate) {
        return estimateService.save(estimate);
    }

    @GetMapping("/{id}")
    public Estimate getById(@PathVariable Long id) {
        return estimateService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        estimateService.deleteById(id);
    }
} 
package com.example.carrepair.service;

import com.example.carrepair.domain.Estimate;
import com.example.carrepair.repository.EstimateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstimateService {
    private final EstimateRepository estimateRepository;

    public EstimateService(EstimateRepository estimateRepository) {
        this.estimateRepository = estimateRepository;
    }

    public List<Estimate> findAll() {
        return estimateRepository.findAll();
    }

    public Estimate save(Estimate estimate) {
        return estimateRepository.save(estimate);
    }

    public Estimate findById(Long id) {
        return estimateRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        estimateRepository.deleteById(id);
    }
} 
package com.example.carrepair.service;

import com.example.carrepair.domain.Repair;
import com.example.carrepair.repository.RepairRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepairService {
    private final RepairRepository repairRepository;

    public RepairService(RepairRepository repairRepository) {
        this.repairRepository = repairRepository;
    }

    public List<Repair> findAll() {
        return repairRepository.findAll();
    }

    public Repair save(Repair repair) {
        return repairRepository.save(repair);
    }

    public Repair findById(Long id) {
        return repairRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        repairRepository.deleteById(id);
    }
} 
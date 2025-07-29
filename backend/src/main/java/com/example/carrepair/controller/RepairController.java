package com.example.carrepair.controller;

import com.example.carrepair.domain.Repair;
import com.example.carrepair.service.RepairService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repairs")
public class RepairController {
    private final RepairService repairService;

    public RepairController(RepairService repairService) {
        this.repairService = repairService;
    }

    @GetMapping
    public List<Repair> getAll() {
        return repairService.findAll();
    }

    @PostMapping
    public Repair create(@RequestBody Repair repair) {
        return repairService.save(repair);
    }

    @GetMapping("/{id}")
    public Repair getById(@PathVariable Long id) {
        return repairService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repairService.deleteById(id);
    }
} 
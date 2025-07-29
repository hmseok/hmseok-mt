package com.example.carrepair.controller;

import com.example.carrepair.domain.Accident;
import com.example.carrepair.service.AccidentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accidents")
public class AccidentController {
    private final AccidentService accidentService;

    public AccidentController(AccidentService accidentService) {
        this.accidentService = accidentService;
    }

    @GetMapping
    public List<Accident> getAll() {
        return accidentService.findAll();
    }

    @PostMapping
    public Accident create(@RequestBody Accident accident) {
        return accidentService.save(accident);
    }

    @GetMapping("/{id}")
    public Accident getById(@PathVariable Long id) {
        return accidentService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        accidentService.deleteById(id);
    }
} 
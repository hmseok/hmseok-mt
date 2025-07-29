package com.example.carrepair.service;

import com.example.carrepair.domain.Accident;
import com.example.carrepair.repository.AccidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccidentService {
    private final AccidentRepository accidentRepository;

    public AccidentService(AccidentRepository accidentRepository) {
        this.accidentRepository = accidentRepository;
    }

    public List<Accident> findAll() {
        return accidentRepository.findAll();
    }

    public Accident save(Accident accident) {
        return accidentRepository.save(accident);
    }

    public Accident findById(Long id) {
        return accidentRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        accidentRepository.deleteById(id);
    }
} 
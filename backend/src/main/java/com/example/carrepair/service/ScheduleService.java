package com.example.carrepair.service;

import com.example.carrepair.domain.Schedule;
import com.example.carrepair.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {
    
    @Autowired
    private ScheduleRepository scheduleRepository;
    
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }
    
    public Schedule getScheduleById(Long id) {
        return scheduleRepository.findById(id).orElse(null);
    }
    
    public Schedule saveSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }
    
    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }
} 
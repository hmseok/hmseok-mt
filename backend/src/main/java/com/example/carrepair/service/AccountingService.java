package com.example.carrepair.service;

import com.example.carrepair.domain.Accounting;
import com.example.carrepair.repository.AccountingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountingService {
    private final AccountingRepository accountingRepository;

    public AccountingService(AccountingRepository accountingRepository) {
        this.accountingRepository = accountingRepository;
    }

    public List<Accounting> findAll() {
        return accountingRepository.findAll();
    }

    public Accounting save(Accounting accounting) {
        return accountingRepository.save(accounting);
    }

    public Accounting findById(Long id) {
        return accountingRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        accountingRepository.deleteById(id);
    }
} 
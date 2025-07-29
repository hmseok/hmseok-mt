package com.example.carrepair.controller;

import com.example.carrepair.domain.Accounting;
import com.example.carrepair.service.AccountingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accountings")
public class AccountingController {
    private final AccountingService accountingService;

    public AccountingController(AccountingService accountingService) {
        this.accountingService = accountingService;
    }

    @GetMapping
    public List<Accounting> getAll() {
        return accountingService.findAll();
    }

    @PostMapping
    public Accounting create(@RequestBody Accounting accounting) {
        return accountingService.save(accounting);
    }

    @GetMapping("/{id}")
    public Accounting getById(@PathVariable Long id) {
        return accountingService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        accountingService.deleteById(id);
    }
} 
package com.fintech.wallet.interfaces.rest;

import com.fintech.wallet.application.transaction.TransactionService;
import com.fintech.wallet.domain.TransactionType;
import com.fintech.wallet.interfaces.dto.CreateTransactionDTO;
import com.fintech.wallet.interfaces.dto.TransactionDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(
            @Valid @RequestBody CreateTransactionDTO createDTO,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        TransactionDTO transaction = transactionService.createTransaction(userId, createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }
    
    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getTransactions(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<TransactionDTO> transactions = transactionService.getTransactions(
                userId, type, categoryId, startDate, endDate
        );
        return ResponseEntity.ok(transactions);
    }
}


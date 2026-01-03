package com.fintech.wallet.application.transaction;

import com.fintech.wallet.application.wallet.WalletService;
import com.fintech.wallet.domain.Transaction;
import com.fintech.wallet.domain.TransactionType;
import com.fintech.wallet.domain.Wallet;
import com.fintech.wallet.infrastructure.persistence.CategoryRepository;
import com.fintech.wallet.infrastructure.persistence.TransactionRepository;
import com.fintech.wallet.infrastructure.mappers.TransactionMapper;
import com.fintech.wallet.interfaces.dto.CreateTransactionDTO;
import com.fintech.wallet.interfaces.dto.TransactionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final WalletService walletService;
    private final CategoryRepository categoryRepository;
    private final TransactionMapper transactionMapper;
    
    @Transactional
    public TransactionDTO createTransaction(Long userId, CreateTransactionDTO createDTO) {
        Wallet wallet = walletService.getWalletByUserId(userId);
        
        Transaction transaction = Transaction.builder()
                .walletId(wallet.getId())
                .type(createDTO.getType())
                .amount(createDTO.getAmount())
                .description(createDTO.getDescription())
                .categoryId(createDTO.getCategoryId())
                .build();
        
        transaction.validate();
        
        walletService.updateBalance(wallet.getId(), createDTO.getAmount(), createDTO.getType());
        
        transaction = transactionRepository.save(transaction);
        
        return transactionMapper.toDTO(transaction);
    }
    
    public List<TransactionDTO> getTransactions(Long userId, TransactionType type, Long categoryId, 
                                                LocalDateTime startDate, LocalDateTime endDate) {
        Wallet wallet = walletService.getWalletByUserId(userId);
        
        List<Transaction> transactions = transactionRepository.findFilteredTransactions(
                wallet.getId(), type, categoryId, startDate, endDate
        );
        
        return transactions.stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<TransactionDTO> getAllTransactions(Long userId) {
        Wallet wallet = walletService.getWalletByUserId(userId);
        List<Transaction> transactions = transactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId());
        
        return transactions.stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }
}


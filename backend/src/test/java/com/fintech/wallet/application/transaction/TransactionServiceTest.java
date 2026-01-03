package com.fintech.wallet.application.transaction;

import com.fintech.wallet.application.wallet.WalletService;
import com.fintech.wallet.domain.Transaction;
import com.fintech.wallet.domain.TransactionType;
import com.fintech.wallet.domain.Wallet;
import com.fintech.wallet.infrastructure.mappers.TransactionMapper;
import com.fintech.wallet.infrastructure.persistence.CategoryRepository;
import com.fintech.wallet.infrastructure.persistence.TransactionRepository;
import com.fintech.wallet.interfaces.dto.CreateTransactionDTO;
import com.fintech.wallet.interfaces.dto.TransactionDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {
    
    @Mock
    private TransactionRepository transactionRepository;
    
    @Mock
    private WalletService walletService;
    
    @Mock
    private CategoryRepository categoryRepository;
    
    @Mock
    private TransactionMapper transactionMapper;
    
    @InjectMocks
    private TransactionService transactionService;
    
    private Wallet wallet;
    private CreateTransactionDTO createDTO;
    
    @BeforeEach
    void setUp() {
        wallet = Wallet.builder()
                .id(1L)
                .userId(1L)
                .balance(new BigDecimal("100.00"))
                .build();
        
        createDTO = new CreateTransactionDTO();
        createDTO.setType(TransactionType.EXPENSE);
        createDTO.setAmount(new BigDecimal("50.00"));
        createDTO.setDescription("Test transaction");
    }
    
    @Test
    void shouldCreateTransaction() {
        Transaction transaction = Transaction.builder()
                .id(1L)
                .walletId(1L)
                .type(TransactionType.EXPENSE)
                .amount(new BigDecimal("50.00"))
                .description("Test transaction")
                .build();
        
        TransactionDTO transactionDTO = TransactionDTO.builder()
                .id(1L)
                .walletId(1L)
                .type(TransactionType.EXPENSE)
                .amount(new BigDecimal("50.00"))
                .description("Test transaction")
                .build();
        
        when(walletService.getWalletByUserId(1L)).thenReturn(wallet);
        when(walletService.updateBalance(any(), any(), any())).thenReturn(wallet);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);
        when(transactionMapper.toDTO(any(Transaction.class))).thenReturn(transactionDTO);
        
        TransactionDTO result = transactionService.createTransaction(1L, createDTO);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(transactionRepository).save(any(Transaction.class));
        verify(walletService).updateBalance(any(), any(), any());
    }
    
    @Test
    void shouldValidateTransactionAmount() {
        createDTO.setAmount(BigDecimal.ZERO);
        
        when(walletService.getWalletByUserId(1L)).thenReturn(wallet);
        
        assertThrows(IllegalArgumentException.class, () -> {
            transactionService.createTransaction(1L, createDTO);
        });
    }
}


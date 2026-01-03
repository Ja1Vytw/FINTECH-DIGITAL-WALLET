package com.fintech.wallet.application.wallet;

import com.fintech.wallet.domain.TransactionType;
import com.fintech.wallet.domain.Wallet;
import com.fintech.wallet.infrastructure.persistence.WalletRepository;
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
class WalletServiceTest {
    
    @Mock
    private WalletRepository walletRepository;
    
    @InjectMocks
    private WalletService walletService;
    
    private Wallet wallet;
    
    @BeforeEach
    void setUp() {
        wallet = Wallet.builder()
                .id(1L)
                .userId(1L)
                .balance(new BigDecimal("100.00"))
                .build();
    }
    
    @Test
    void shouldUpdateBalanceWithIncome() {
        when(walletRepository.findById(1L)).thenReturn(Optional.of(wallet));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(invocation -> invocation.getArgument(0));
        
        Wallet updated = walletService.updateBalance(1L, new BigDecimal("50.00"), TransactionType.INCOME);
        
        assertEquals(new BigDecimal("150.00"), updated.getBalance());
        verify(walletRepository).save(any(Wallet.class));
    }
    
    @Test
    void shouldUpdateBalanceWithExpense() {
        when(walletRepository.findById(1L)).thenReturn(Optional.of(wallet));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(invocation -> invocation.getArgument(0));
        
        Wallet updated = walletService.updateBalance(1L, new BigDecimal("30.00"), TransactionType.EXPENSE);
        
        assertEquals(new BigDecimal("70.00"), updated.getBalance());
        verify(walletRepository).save(any(Wallet.class));
    }
    
    @Test
    void shouldThrowExceptionWhenBalanceWouldBeNegative() {
        when(walletRepository.findById(1L)).thenReturn(Optional.of(wallet));
        
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> walletService.updateBalance(1L, new BigDecimal("150.00"), TransactionType.EXPENSE)
        );
        
        assertTrue(exception.getMessage().contains("Saldo insuficiente"));
        verify(walletRepository, never()).save(any(Wallet.class));
    }
    
    @Test
    void shouldAllowExactBalanceExpense() {
        when(walletRepository.findById(1L)).thenReturn(Optional.of(wallet));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(invocation -> invocation.getArgument(0));
        
        Wallet updated = walletService.updateBalance(1L, new BigDecimal("100.00"), TransactionType.EXPENSE);
        
        assertEquals(BigDecimal.ZERO, updated.getBalance());
    }
}


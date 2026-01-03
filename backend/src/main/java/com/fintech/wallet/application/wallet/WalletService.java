package com.fintech.wallet.application.wallet;

import com.fintech.wallet.domain.TransactionType;
import com.fintech.wallet.domain.Wallet;
import com.fintech.wallet.infrastructure.persistence.WalletRepository;
import com.fintech.wallet.interfaces.dto.WalletDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class WalletService {
    
    private final WalletRepository walletRepository;
    
    public WalletDTO getBalance(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Carteira não encontrada"));
        
        return WalletDTO.builder()
                .id(wallet.getId())
                .userId(wallet.getUserId())
                .balance(wallet.getBalance())
                .build();
    }
    
    @Transactional
    public Wallet updateBalance(Long walletId, BigDecimal amount, TransactionType type) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new IllegalArgumentException("Carteira não encontrada"));
        
        BigDecimal newBalance;
        if (type == TransactionType.INCOME) {
            newBalance = wallet.getBalance().add(amount);
        } else {
            newBalance = wallet.getBalance().subtract(amount);
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Saldo insuficiente. Saldo atual: " + wallet.getBalance());
            }
        }
        
        wallet.setBalance(newBalance);
        wallet.validateBalance();
        
        return walletRepository.save(wallet);
    }
    
    public Wallet getWalletByUserId(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Carteira não encontrada"));
    }
}


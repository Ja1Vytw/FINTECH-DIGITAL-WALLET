package com.fintech.wallet.interfaces.rest;

import com.fintech.wallet.application.wallet.WalletService;
import com.fintech.wallet.interfaces.dto.WalletDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {
    
    private final WalletService walletService;
    
    @GetMapping("/balance")
    public ResponseEntity<WalletDTO> getBalance(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        WalletDTO wallet = walletService.getBalance(userId);
        return ResponseEntity.ok(wallet);
    }
}


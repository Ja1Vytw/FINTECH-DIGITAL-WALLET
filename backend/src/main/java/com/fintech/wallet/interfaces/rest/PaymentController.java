package com.fintech.wallet.interfaces.rest;

import com.fintech.wallet.application.payment.CreatePaymentRequest;
import com.fintech.wallet.application.payment.PaymentResult;
import com.fintech.wallet.application.payment.PaymentService;
import com.fintech.wallet.interfaces.dto.CreatePaymentDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    
    private final PaymentService paymentService;
    
    @PostMapping
    public ResponseEntity<PaymentResult> createPayment(
            @Valid @RequestBody CreatePaymentDTO dto,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        
        CreatePaymentRequest request = CreatePaymentRequest.builder()
                .amount(dto.getAmount())
                .method(dto.getMethod())
                .recipient(dto.getRecipient())
                .description(dto.getDescription())
                .pixKey(dto.getPixKey())
                .bankAccount(dto.getBankAccount())
                .bankAgency(dto.getBankAgency())
                .bankCode(dto.getBankCode())
                .build();
        
        PaymentResult result = paymentService.processPayment(userId, request);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping
    public ResponseEntity<List<PaymentResult>> getPayments(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<PaymentResult> payments = paymentService.getPayments(userId);
        return ResponseEntity.ok(payments);
    }
    
    @PostMapping("/pix/qrcode")
    public ResponseEntity<Map<String, String>> generatePixQrCode(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String description = request.get("description") != null 
            ? request.get("description").toString() 
            : null;
        
        String qrCode = paymentService.generatePixQrCode(amount, description);
        return ResponseEntity.ok(Map.of("qrCode", qrCode));
    }
}


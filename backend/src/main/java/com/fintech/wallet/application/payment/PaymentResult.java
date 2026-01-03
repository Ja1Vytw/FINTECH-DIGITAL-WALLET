package com.fintech.wallet.application.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResult {
    private Long id;
    private BigDecimal amount;
    private String method;
    private String recipient;
    private String description;
    private String status;
    private LocalDateTime createdAt;
}


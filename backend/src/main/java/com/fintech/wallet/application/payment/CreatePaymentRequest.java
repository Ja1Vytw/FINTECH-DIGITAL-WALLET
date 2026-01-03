package com.fintech.wallet.application.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentRequest {
    private BigDecimal amount;
    private String method;
    private String recipient;
    private String description;
    private String pixKey;
    private String bankAccount;
    private String bankAgency;
    private String bankCode;
}


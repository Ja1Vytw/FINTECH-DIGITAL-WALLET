package com.fintech.wallet.interfaces.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentDTO {
    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor mínimo é R$ 0,01")
    private BigDecimal amount;

    @NotBlank(message = "Método de pagamento é obrigatório")
    private String method;

    @NotBlank(message = "Destinatário é obrigatório")
    private String recipient;

    private String description;
    private String pixKey;
    private String bankAccount;
    private String bankAgency;
    private String bankCode;
}


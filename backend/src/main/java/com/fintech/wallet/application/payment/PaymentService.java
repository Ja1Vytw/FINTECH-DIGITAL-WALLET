package com.fintech.wallet.application.payment;

import com.fintech.wallet.application.transaction.TransactionService;
import com.fintech.wallet.application.wallet.WalletService;
import com.fintech.wallet.domain.TransactionType;
import com.fintech.wallet.domain.Wallet;
import com.fintech.wallet.infrastructure.persistence.TransactionRepository;
import com.fintech.wallet.interfaces.dto.CreateTransactionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final WalletService walletService;
    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;
    
    @Transactional
    public PaymentResult processPayment(Long userId, CreatePaymentRequest request) {
        Wallet wallet = walletService.getWalletByUserId(userId);
        
        if (wallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new IllegalArgumentException("Saldo insuficiente");
        }
        
        String description = buildPaymentDescription(request);
        
        CreateTransactionDTO createDTO = new CreateTransactionDTO();
        createDTO.setType(TransactionType.EXPENSE);
        createDTO.setAmount(request.getAmount());
        createDTO.setDescription(description);
        createDTO.setCategoryId(null);
        
        var transactionDTO = transactionService.createTransaction(userId, createDTO);
        
        return PaymentResult.builder()
                .id(transactionDTO.getId())
                .amount(transactionDTO.getAmount())
                .method(request.getMethod())
                .recipient(request.getRecipient())
                .description(description)
                .status("COMPLETED")
                .createdAt(transactionDTO.getCreatedAt())
                .build();
    }
    
    public List<PaymentResult> getPayments(Long userId) {
        Wallet wallet = walletService.getWalletByUserId(userId);
        
        return transactionRepository.findByWalletIdAndTypeOrderByCreatedAtDesc(
            wallet.getId(),
            TransactionType.EXPENSE
        ).stream()
        .map(t -> PaymentResult.builder()
            .id(t.getId())
            .amount(t.getAmount())
            .method(extractPaymentMethod(t.getDescription()))
            .recipient(extractRecipient(t.getDescription()))
            .description(t.getDescription())
            .status("COMPLETED")
            .createdAt(t.getCreatedAt())
            .build())
        .collect(Collectors.toList());
    }
    
    public String generatePixQrCode(BigDecimal amount, String description) {
        return String.format(
            "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='white'/><text x='100' y='100' text-anchor='middle' font-size='12'>QR Code PIX</text><text x='100' y='120' text-anchor='middle' font-size='10'>R$ %.2f</text></svg>",
            amount
        );
    }
    
    private String buildPaymentDescription(CreatePaymentRequest request) {
        switch (request.getMethod()) {
            case "PIX":
                return String.format("Pagamento PIX para %s", request.getRecipient());
            case "TRANSFER":
                return String.format("Transferência para %s", request.getRecipient());
            case "BILL":
                return String.format("Pagamento de boleto %s", request.getDescription() != null ? request.getDescription() : "");
            default:
                return request.getDescription() != null ? request.getDescription() : "Pagamento";
        }
    }
    
    private String extractPaymentMethod(String description) {
        if (description != null) {
            if (description.contains("PIX")) return "PIX";
            if (description.contains("Transferência")) return "TRANSFER";
            if (description.contains("boleto")) return "BILL";
        }
        return "UNKNOWN";
    }
    
    private String extractRecipient(String description) {
        if (description != null) {
            if (description.contains("para ")) {
                return description.substring(description.indexOf("para ") + 5);
            }
        }
        return "N/A";
    }
}


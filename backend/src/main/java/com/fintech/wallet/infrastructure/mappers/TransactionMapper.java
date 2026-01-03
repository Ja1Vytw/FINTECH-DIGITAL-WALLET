package com.fintech.wallet.infrastructure.mappers;

import com.fintech.wallet.domain.Category;
import com.fintech.wallet.domain.Transaction;
import com.fintech.wallet.infrastructure.persistence.CategoryRepository;
import com.fintech.wallet.interfaces.dto.TransactionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransactionMapper {
    
    private final CategoryRepository categoryRepository;
    
    public TransactionDTO toDTO(Transaction transaction) {
        String categoryName = null;
        if (transaction.getCategoryId() != null) {
            categoryName = categoryRepository.findById(transaction.getCategoryId())
                    .map(Category::getName)
                    .orElse(null);
        }
        
        return TransactionDTO.builder()
                .id(transaction.getId())
                .walletId(transaction.getWalletId())
                .type(transaction.getType())
                .amount(transaction.getAmount())
                .description(transaction.getDescription())
                .categoryId(transaction.getCategoryId())
                .categoryName(categoryName)
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}


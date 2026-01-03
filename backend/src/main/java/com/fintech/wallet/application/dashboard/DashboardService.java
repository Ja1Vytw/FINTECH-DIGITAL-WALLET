package com.fintech.wallet.application.dashboard;

import com.fintech.wallet.application.wallet.WalletService;
import com.fintech.wallet.domain.Category;
import com.fintech.wallet.domain.TransactionType;
import com.fintech.wallet.domain.Wallet;
import com.fintech.wallet.infrastructure.persistence.CategoryRepository;
import com.fintech.wallet.infrastructure.persistence.TransactionRepository;
import com.fintech.wallet.interfaces.dto.CategorySummaryDTO;
import com.fintech.wallet.interfaces.dto.DashboardDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final WalletService walletService;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    
    public DashboardDTO getDashboardData(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        Wallet wallet = walletService.getWalletByUserId(userId);
        
        if (startDate == null) {
            startDate = LocalDateTime.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }
        
        BigDecimal totalIncome = transactionRepository.sumAmountByWalletIdAndTypeAndDateRange(
                wallet.getId(), TransactionType.INCOME, startDate, endDate
        );
        if (totalIncome == null) {
            totalIncome = BigDecimal.ZERO;
        }
        
        BigDecimal totalExpense = transactionRepository.sumAmountByWalletIdAndTypeAndDateRange(
                wallet.getId(), TransactionType.EXPENSE, startDate, endDate
        );
        if (totalExpense == null) {
            totalExpense = BigDecimal.ZERO;
        }
        
        List<CategorySummaryDTO> expensesByCategory = getCategorySummaries(
                wallet.getId(), TransactionType.EXPENSE, startDate, endDate
        );
        
        List<CategorySummaryDTO> incomeByCategory = getCategorySummaries(
                wallet.getId(), TransactionType.INCOME, startDate, endDate
        );
        
        return DashboardDTO.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(wallet.getBalance())
                .expensesByCategory(expensesByCategory)
                .incomeByCategory(incomeByCategory)
                .build();
    }
    
    private List<CategorySummaryDTO> getCategorySummaries(Long walletId, TransactionType type, 
                                                          LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> results = transactionRepository.sumAmountByCategoryAndType(
                walletId, type, startDate, endDate
        );
        
        List<CategorySummaryDTO> summaries = new ArrayList<>();
        for (Object[] result : results) {
            Long categoryId = ((Number) result[0]).longValue();
            BigDecimal total = (BigDecimal) result[1];
            
            Category category = categoryRepository.findById(categoryId).orElse(null);
            String categoryName = category != null ? category.getName() : "Sem categoria";
            String categoryColor = category != null ? category.getColor() : "#6b7280";
            
            summaries.add(CategorySummaryDTO.builder()
                    .categoryId(categoryId)
                    .categoryName(categoryName)
                    .categoryColor(categoryColor)
                    .total(total)
                    .build());
        }
        
        return summaries;
    }
}


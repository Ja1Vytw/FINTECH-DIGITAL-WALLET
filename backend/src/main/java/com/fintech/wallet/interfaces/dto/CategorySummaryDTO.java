package com.fintech.wallet.interfaces.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategorySummaryDTO {
    private Long categoryId;
    private String categoryName;
    private String categoryColor;
    private BigDecimal total;
}


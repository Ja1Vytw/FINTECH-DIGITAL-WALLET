package com.fintech.wallet.infrastructure.persistence;

import com.fintech.wallet.domain.Transaction;
import com.fintech.wallet.domain.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);
    
    List<Transaction> findByWalletIdAndTypeOrderByCreatedAtDesc(Long walletId, TransactionType type);
    
    List<Transaction> findByWalletIdAndCategoryIdOrderByCreatedAtDesc(Long walletId, Long categoryId);
    
    @Query("SELECT t FROM Transaction t WHERE t.walletId = :walletId " +
           "AND (:type IS NULL OR t.type = :type) " +
           "AND (:categoryId IS NULL OR t.categoryId = :categoryId) " +
           "AND (:startDate IS NULL OR t.createdAt >= :startDate) " +
           "AND (:endDate IS NULL OR t.createdAt <= :endDate) " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findFilteredTransactions(
            @Param("walletId") Long walletId,
            @Param("type") TransactionType type,
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.walletId = :walletId AND t.type = :type")
    java.math.BigDecimal sumAmountByWalletIdAndType(@Param("walletId") Long walletId, @Param("type") TransactionType type);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.walletId = :walletId " +
           "AND t.type = :type " +
           "AND t.createdAt >= :startDate AND t.createdAt <= :endDate")
    java.math.BigDecimal sumAmountByWalletIdAndTypeAndDateRange(
            @Param("walletId") Long walletId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT t.categoryId, SUM(t.amount) FROM Transaction t " +
           "WHERE t.walletId = :walletId AND t.type = :type " +
           "AND t.createdAt >= :startDate AND t.createdAt <= :endDate " +
           "GROUP BY t.categoryId")
    List<Object[]> sumAmountByCategoryAndType(
            @Param("walletId") Long walletId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}


package com.fintech.wallet.infrastructure.persistence;

import com.fintech.wallet.domain.Category;
import com.fintech.wallet.domain.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByType(TransactionType type);
    List<Category> findByUserId(Long userId);
    List<Category> findByUserIdOrUserIdIsNull(Long userId);
    
    @Query("SELECT c FROM Category c WHERE c.type = :type AND (c.userId = :userId OR c.userId IS NULL)")
    List<Category> findByTypeAndUserIdOrUserIdIsNull(@Param("type") TransactionType type, @Param("userId") Long userId);
}


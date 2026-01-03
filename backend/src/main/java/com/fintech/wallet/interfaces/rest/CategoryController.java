package com.fintech.wallet.interfaces.rest;

import com.fintech.wallet.domain.Category;
import com.fintech.wallet.domain.TransactionType;
import com.fintech.wallet.infrastructure.persistence.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryRepository categoryRepository;
    
    @GetMapping
    public ResponseEntity<List<Category>> getCategories(
            @RequestParam(required = false) TransactionType type,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        
        List<Category> categories;
        if (type != null) {
            categories = categoryRepository.findByTypeAndUserIdOrUserIdIsNull(type, userId);
        } else {
            categories = categoryRepository.findByUserIdOrUserIdIsNull(userId);
        }
        
        return ResponseEntity.ok(categories);
    }
}


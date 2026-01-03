package com.fintech.wallet.infrastructure.mappers;

import com.fintech.wallet.domain.User;
import com.fintech.wallet.interfaces.dto.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }
}


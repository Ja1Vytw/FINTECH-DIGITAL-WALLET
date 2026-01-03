package com.fintech.wallet.interfaces.rest;

import com.fintech.wallet.application.auth.AuthService;
import com.fintech.wallet.domain.User;
import com.fintech.wallet.infrastructure.mappers.UserMapper;
import com.fintech.wallet.infrastructure.persistence.UserRepository;
import com.fintech.wallet.interfaces.dto.AuthResponseDTO;
import com.fintech.wallet.interfaces.dto.LoginDTO;
import com.fintech.wallet.interfaces.dto.RegisterDTO;
import com.fintech.wallet.interfaces.dto.UserDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterDTO registerDTO) {
        AuthResponseDTO response = authService.register(registerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        AuthResponseDTO response = authService.login(loginDTO);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        
        return ResponseEntity.ok(userMapper.toDTO(user));
    }
}


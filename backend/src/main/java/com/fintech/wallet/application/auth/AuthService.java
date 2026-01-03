package com.fintech.wallet.application.auth;

import com.fintech.wallet.domain.User;
import com.fintech.wallet.domain.Wallet;
import com.fintech.wallet.infrastructure.persistence.UserRepository;
import com.fintech.wallet.infrastructure.persistence.WalletRepository;
import com.fintech.wallet.infrastructure.security.JwtTokenProvider;
import com.fintech.wallet.interfaces.dto.AuthResponseDTO;
import com.fintech.wallet.interfaces.dto.LoginDTO;
import com.fintech.wallet.interfaces.dto.RegisterDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    
    @Transactional
    public AuthResponseDTO register(RegisterDTO registerDTO) {
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new IllegalArgumentException("Email já está em uso");
        }
        
        User user = User.builder()
                .name(registerDTO.getName())
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .country(registerDTO.getCountry())
                .postalCode(registerDTO.getPostalCode())
                .street(registerDTO.getStreet())
                .city(registerDTO.getCity())
                .state(registerDTO.getState())
                .phone(registerDTO.getPhone())
                .document(registerDTO.getDocument())
                .birthDate(registerDTO.getBirthDate())
                .build();
        
        user = userRepository.save(user);
        
        Wallet wallet = Wallet.builder()
                .userId(user.getId())
                .balance(BigDecimal.ZERO)
                .build();
        
        walletRepository.save(wallet);
        
        String token = tokenProvider.generateToken(user.getId(), user.getEmail());
        
        return AuthResponseDTO.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }
    
    public AuthResponseDTO login(LoginDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));
        
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }
        
        String token = tokenProvider.generateToken(user.getId(), user.getEmail());
        
        return AuthResponseDTO.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }
}


package com.fintech.wallet.interfaces.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintech.wallet.interfaces.dto.LoginDTO;
import com.fintech.wallet.interfaces.dto.RegisterDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void shouldRegisterUser() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setName("Test User");
        registerDTO.setEmail("test@example.com");
        registerDTO.setPassword("password123");
        
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.userId").exists())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }
    
    @Test
    void shouldLoginUser() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setName("Test User");
        registerDTO.setEmail("login@example.com");
        registerDTO.setPassword("password123");
        
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDTO)));
        
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("login@example.com");
        loginDTO.setPassword("password123");
        
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value("login@example.com"));
    }
}


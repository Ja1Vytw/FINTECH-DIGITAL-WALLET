package com.fintech.wallet.interfaces.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterDTO {
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 255, message = "Nome deve ter entre 2 e 255 caracteres")
    private String name;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ter formato válido")
    private String email;
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String password;
    
    @NotBlank(message = "País é obrigatório")
    private String country;
    
    @NotBlank(message = "CEP/Código Postal é obrigatório")
    private String postalCode;
    
    @NotBlank(message = "Rua é obrigatória")
    private String street;
    
    @NotBlank(message = "Cidade é obrigatória")
    private String city;
    
    private String state;
    
    @NotBlank(message = "Telefone é obrigatório")
    private String phone;
    
    @NotBlank(message = "Documento é obrigatório")
    private String document;
    
    @NotNull(message = "Data de nascimento é obrigatória")
    private LocalDate birthDate;
}


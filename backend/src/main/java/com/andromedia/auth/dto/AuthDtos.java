// src/main/java/com/andromedia/auth/dto/AuthDtos.java
package com.andromedia.auth.dto;

import jakarta.validation.constraints.*;

public class AuthDtos {
  public record RegisterRequest(
      @NotBlank @Email String email,
      @NotBlank @Size(min=6,max=100) String password,
      @NotBlank String displayName
  ) {}

  public record LoginRequest(
      @NotBlank @Email String email,
      @NotBlank String password
  ) {}

  public record AuthResponse(
      String token,
      Long userId,
      String email,
      String displayName
  ) {}
}

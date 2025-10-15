// src/main/java/com/andromedia/auth/AuthService.java
package com.andromedia.auth;

import com.andromedia.auth.dto.AuthDtos.*;
import com.andromedia.model.User;
import com.andromedia.repository.UserRepository;
import com.andromedia.security.JwtUtil;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final AuthenticationManager authManager;
  private final JwtUtil jwt;

  public AuthService(UserRepository users, PasswordEncoder encoder, AuthenticationManager am, JwtUtil jwt) {
    this.users = users; this.encoder = encoder; this.authManager = am; this.jwt = jwt;
  }

  public AuthResponse register(RegisterRequest req) {
    if (users.existsByEmail(req.email())) {
      throw new IllegalArgumentException("Email already registered");
    }
    User u = User.builder()
        .email(req.email())
        .password(encoder.encode(req.password()))
        .displayName(req.displayName())
        .roles(Set.of("USER"))
        .build();
    users.save(u);

    String token = jwt.generateToken(u.getEmail(), Map.of("uid", u.getId(), "roles", u.getRoles()));
    return new AuthResponse(token, u.getId(), u.getEmail(), u.getDisplayName());
  }

  public AuthResponse login(LoginRequest req) {
    authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
    User u = users.findByEmail(req.email()).orElseThrow();
    String token = jwt.generateToken(u.getEmail(), Map.of("uid", u.getId(), "roles", u.getRoles()));
    return new AuthResponse(token, u.getId(), u.getEmail(), u.getDisplayName());
  }
}

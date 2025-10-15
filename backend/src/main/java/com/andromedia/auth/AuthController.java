// src/main/java/com/andromedia/auth/AuthController.java
package com.andromedia.auth;

import com.andromedia.auth.dto.AuthDtos.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
  private final AuthService auth;

  public AuthController(AuthService auth) { this.auth = auth; }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
    return ResponseEntity.ok(auth.register(req));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
    return ResponseEntity.ok(auth.login(req));
  }

  // demo: a protected test route
  @GetMapping("/me")
  public ResponseEntity<?> me(@RequestAttribute(name = "ignored", required = false) String ignored) {
    // with the filter set, you can also read the Principal from SecurityContext in real endpoints
    return ResponseEntity.ok().build();
  }
}

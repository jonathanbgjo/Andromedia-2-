package com.andromedia.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {
    private final SecretKey key;
    private final long expirationSeconds;

    public JwtUtil(org.springframework.core.env.Environment env) {
        String secret = env.getProperty("app.jwt.secret");
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                "app.jwt.secret (env JWT_SECRET) must be configured — refusing to start with a default secret.");
        }
        byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < 32) {
            throw new IllegalStateException(
                "app.jwt.secret must be at least 32 bytes for HS256 (got " + secretBytes.length + ").");
        }
        this.key = Keys.hmacShaKeyFor(secretBytes);
        this.expirationSeconds = Long.parseLong(env.getProperty("app.jwt.expiration-seconds", "86400").trim());
    }

    public String generateToken(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(expirationSeconds)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    public String getSubject(String token) {
        return parse(token).getBody().getSubject();
    }
}

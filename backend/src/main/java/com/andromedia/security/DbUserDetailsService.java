// src/main/java/com/andromedia/security/DbUserDetailsService.java
package com.andromedia.security;

import com.andromedia.model.User;
import com.andromedia.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class DbUserDetailsService implements UserDetailsService {
  private final UserRepository users;

  public DbUserDetailsService(UserRepository users) {
    this.users = users;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User u = users.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Not found"));
    return new org.springframework.security.core.userdetails.User(
        u.getEmail(),
        u.getPassword(),
        u.getRoles().stream().map(r -> new SimpleGrantedAuthority("ROLE_" + r)).collect(Collectors.toSet())
    );
  }
}

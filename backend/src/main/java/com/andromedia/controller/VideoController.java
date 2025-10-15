// src/main/java/com/andromedia/video/VideoController.java
package com.andromedia.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

  @GetMapping("/secure-ping")
  public ResponseEntity<String> securePing() {
    return ResponseEntity.ok("pong (secure)");
  }
}

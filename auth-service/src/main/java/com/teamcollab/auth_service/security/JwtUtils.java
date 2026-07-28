package com.teamcollab.auth_service.security;

import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

@Slf4j
@Component
public class JwtUtils {
    @Value("${jwt.private-key}")
    private String privateKeyStr;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    private RSAPrivateKey privateKey;

    @PostConstruct
    public void init() throws Exception {
        String stripped = privateKeyStr
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replace("-----BEGIN RSA PRIVATE KEY-----", "")
                .replace("-----END RSA PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");

        byte[] decoded = Base64.getDecoder().decode(stripped);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
        this.privateKey = (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(spec);
        log.info("RSA private key loaded");
    }

    public String generateToken(CustomUserDetails userDetails) {
        Date now = new Date();
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .claims(Map.of(
                        "user_id", userDetails.getUserId(),
                        "name",    userDetails.getName()
                ))
                .signWith(privateKey)
                .compact();
    }
}

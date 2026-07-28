package com.teamcollab.workspaceservice.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Slf4j
@Component
public class JwtValidator {
    @Value("${jwt.public-key}")
    private String publicKeyStr;

    private RSAPublicKey publicKey;

    @PostConstruct
    public void init() throws Exception {
        String stripped = publicKeyStr
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");

        byte[] decoded = Base64.getDecoder().decode(stripped);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
        this.publicKey = (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(spec);
        log.info("RSA public key loaded");
    }

    /**
     * Verifies signature and expiry, throws JwtException/IllegalArgumentException if invalid.
     */
    public Claims parseAndValidate(String token) {
        return Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

package com.example.system.common.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtUtil {
    // 签名密钥
    private static final String SECRET = "system_secret_key_123456";
    // 过期时间：7200秒
    private static final long EXPIRATION = 7200000L;

    /**
     * 生成 Token (登录时调用)
     */
    public static String createToken(Long userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date()) // 建议加上签发时间
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION * 1000))
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .compact();
    }

    /**
     * 新增：从 Token 中获取用户 ID (登出时调用)
     * 解决 SysUserController 中 getUserId 报错的问题
     */
    public static Long getUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET)
                    .parseClaimsJws(token)
                    .getBody();
            // 提取存入的 userId
            Object userId = claims.get("userId");
            return userId != null ? Long.valueOf(userId.toString()) : null;
        } catch (Exception e) {
            // Token 过期或被篡改会进入异常
            return null;
        }
    }

}
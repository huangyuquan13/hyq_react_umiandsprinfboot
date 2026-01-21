package com.example.system.dto.request;

import lombok.Data;

/**
 * 登录接口请求参数
 */
@Data
public class LoginDTO {
    private String username;
    private String password;
}
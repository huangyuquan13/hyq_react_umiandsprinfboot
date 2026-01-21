package com.example.system.dto.request;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private Long id;         // 用户 ID (必填)
    private String realName; // 真实姓名
    private String phone;    // 手机号码
    private Integer status;  // 账号状态
}
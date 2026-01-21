package com.example.system.dto.request;

import lombok.Data;

@Data
public class UserAddDTO {
    // 手机号 (必填)
    private String phone;

    // 真实姓名 (必填)
    private String realName;

    // 状态 (必填，默认为1)
    private Integer status;
}
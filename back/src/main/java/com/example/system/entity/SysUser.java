package com.example.system.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 对应数据库表 sys_user (图五)
 */
@Data
public class SysUser {
    private Long id;
    private String username;
    private String password;
    private String phone;
    private String realName;      // 对应字段 real_name
    private Integer status;
    private LocalDateTime createTime; // 对应字段 create_time
    private LocalDateTime updateTime; // 对应字段 update_time
    private LocalDateTime lastLoginTime; // 对应字段 last_login_time
}
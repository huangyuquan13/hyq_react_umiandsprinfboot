package com.example.system.common.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserAddVO {
    // 返回 ID
    private Long id;
    // 返回生成的账号
    private String username;
    // 返回真实姓名
    private String real_name;
    // 返回创建时间
    private String createTime;
}
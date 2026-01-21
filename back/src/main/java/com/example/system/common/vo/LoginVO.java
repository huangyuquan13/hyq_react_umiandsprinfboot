package com.example.system.common.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 登录接口返回数据结构 (图四)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginVO {

    private String token;

    @JsonProperty("token_type") // JSON key: token_type
    private String tokenType;

    @JsonProperty("expires_in") // JSON key: expires_in
    private Long expiresIn;

    @JsonProperty("user_info") // JSON key: user_info
    private UserInfoVO userInfo;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfoVO {
        private Long id;
        private String username;

        @JsonProperty("real_name") // JSON key: real_name
        private String realName;

        private Integer status;
    }
}
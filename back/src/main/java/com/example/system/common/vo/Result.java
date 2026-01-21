package com.example.system.common.vo;

import lombok.Data;

/**
 * 统一返回结果类 (对应图二公共返回码)
 */
@Data
public class Result<T> {
    private Integer code;
    private String message;
    private T data;

    public Result() {}

    public Result(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> Result<T> success(T data) {
        // 图二：SUCCESS code 100200
        return new Result<>(100200, "操作成功", data);
    }

    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }
}
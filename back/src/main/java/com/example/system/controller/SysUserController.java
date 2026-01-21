package com.example.system.controller;

import com.example.system.common.utils.JwtUtil;
import com.example.system.common.vo.Result;
import com.example.system.common.vo.UserAddVO;
import com.example.system.dto.request.LoginDTO;
import com.example.system.dto.request.UserAddDTO;
import com.example.system.dto.request.UserUpdateDTO;
import com.example.system.service.SysUserService;
import com.example.system.common.vo.LoginVO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/user") // 图四接口路径
public class SysUserController {

    @Autowired
    private SysUserService sysUserService;

    /**
     * 登录接口
     */
    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody LoginDTO loginDTO) {
        if (loginDTO == null || loginDTO.getUsername() == null || loginDTO.getPassword() == null) {
            return Result.error(100400, "用户名和密码不能为空");
        }
        return sysUserService.login(loginDTO);
    }
    @PostMapping("/logout")
    public Result<Void> logout(@RequestHeader("Authorization") String token) {
        // 1. 处理 Token 格式
        // 前端传来的通常是 "Bearer eyJhbG..."，需要去掉 "Bearer " 前缀
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // 2. 调用 JwtUtil 解析 Token 获得用户 ID
        // 假设你的 JwtUtil 中有解析 id 的方法（通常名为 getUserId 或从 Claims 获取）
        Long userId = JwtUtil.getUserId(token);

        // 3. 调用 Service 执行 Redis 删除逻辑
        return sysUserService.logout(userId);
    }
    /**
     * 新增用户接口
     * URL: /api/v1/user/add
     * Method: POST
     */
    @PostMapping("/add")
    public Result<UserAddVO> addUser(@RequestBody UserAddDTO userAddDTO) {
        return sysUserService.addUser(userAddDTO);
    }

    @GetMapping("/list")
    public Result getUserList(
            @RequestParam(required = false) Integer current,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String username,
            @RequestParam(required = false, name = "real_name") String realName, // 注意文档参数是 real_name
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) Integer status) {

        Map<String, Object> data = sysUserService.getUserList(current, size, username, realName, phone, status);
        return Result.success(data); // 假设你的 Result 类有 success 方法返回 100200 状态码
    }

    /**
     * 更新用户接口
     */
    @PutMapping("/update")
    public Result<Map<String, String>> updateUser(@RequestBody UserUpdateDTO updateDTO) {
        return sysUserService.updateUser(updateDTO);
    }

    // SysUserController.java
    @PutMapping("/disable")
    public Result<Map<String, Integer>> disableUser(@RequestParam("id") Long id) {
        // 匹配接口文档: PUT /api/v1/user/disable?id=xxx
        return sysUserService.disableUser(id);
    }

    @PutMapping("/enable")
    public Result<Map<String, Integer>> enableUser(@RequestParam("id") Long id) {
        // 匹配文档路径: PUT /api/v1/user/enable?id=xxx
        return sysUserService.enableUser(id);
    }


}
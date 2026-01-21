package com.example.system.service;

import com.example.system.common.vo.Result;
import com.example.system.common.vo.UserAddVO;
import com.example.system.dto.request.LoginDTO;
import com.example.system.common.vo.LoginVO;
import com.example.system.dto.request.UserAddDTO;
import com.example.system.dto.request.UserUpdateDTO;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface SysUserService {
    // 确保这里定义了 login 方法，且参数和返回值与 Controller 一致
    Result<LoginVO> login(LoginDTO loginDTO);
    Result<Void> logout(Long userId);
    Result<UserAddVO> addUser(UserAddDTO userAddDTO);
    Map<String, Object> getUserList(Integer current, Integer size, String username, String realName, String phone, Integer status);
    Result<Map<String, String>> updateUser(UserUpdateDTO updateDTO);
    Result<Map<String, Integer>> disableUser(Long id);
    Result<Map<String, Integer>> enableUser(Long id);


}
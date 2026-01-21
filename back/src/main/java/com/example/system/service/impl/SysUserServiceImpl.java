package com.example.system.service.impl;

import com.example.system.common.utils.JwtUtil;
import com.example.system.common.vo.Result;
import com.example.system.common.vo.UserAddVO;
import com.example.system.dto.request.LoginDTO;
import com.example.system.dto.request.UserAddDTO;
import com.example.system.dto.request.UserUpdateDTO;
import com.example.system.entity.SysUser;
import com.example.system.mapper.SysUserMapper;
import com.example.system.service.SysUserService;
import com.example.system.common.vo.LoginVO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate; // 新增
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit; // 新增

@Service
public class SysUserServiceImpl implements SysUserService {

    @Autowired
    private SysUserMapper sysUserMapper;

    @Autowired
    private StringRedisTemplate redisTemplate; // 注入 Redis 模板

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Result<UserAddVO> addUser(UserAddDTO dto) {
        // 1. 校验手机号 (简单校验长度)
        if (dto.getPhone() == null || dto.getPhone().length() != 11) {
            return Result.error(100400, "手机号格式不正确");
        }

        SysUser user = new SysUser();

        // 2. 填充基础信息
        user.setRealName(dto.getRealName());
        user.setPhone(dto.getPhone());
        // 默认启用(1)，如果前端没传则设为1
        user.setStatus(dto.getStatus() != null ? dto.getStatus() : 1);
        user.setCreateTime(LocalDateTime.now());

        // 3. 生成密码逻辑
        // 截取手机号后6位
        String rawPassword = dto.getPhone().substring(5);
        // BCrypt 加密存储
        user.setPassword(passwordEncoder.encode(rawPassword));

        // 4. 生成用户名逻辑 (YZ + 序号)
        // 这里模拟生成唯一的序列号，实际项目中可能需要查库获取 maxId
        // 示例：YZ + 当前毫秒数 (保证唯一性)
        String generatedUsername = "YZ" + System.currentTimeMillis();
        user.setUsername(generatedUsername);

        // 5. 插入数据库
        // 注意：需要在 Mapper XML 中配置 useGeneratedKeys="true" keyProperty="id"
        // 才能在插入后获取到 user.getId()
        sysUserMapper.insert(user);

        // 6. 组装返回数据
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        UserAddVO vo = UserAddVO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .real_name(user.getRealName())
                .createTime(df.format(user.getCreateTime()))
                .build();

        return Result.success(vo);
    }

    // SysUserServiceImpl.java
// SysUserServiceImpl.java
    @Override
    public Result<Map<String, Integer>> disableUser(Long id) {
        // 1. 查询用户是否存在
        SysUser user = sysUserMapper.selectById(id);
        if (user == null) {
            return Result.error(100404, "用户不存在");
        }

        // 2. 更新状态为 0 (停用)
        user.setStatus(0);
        user.setUpdateTime(LocalDateTime.now());

        // 调用刚才写了注解的 updateById 方法
        sysUserMapper.updateById(user);

        // 3. 返回指定格式的 Map
        Map<String, Integer> resultMap = new HashMap<>();
        resultMap.put("status", 0);

        return Result.success(resultMap);
    }

    @Override
    public Result<Map<String, Integer>> enableUser(Long id) {
        // 1. 复用你刚写好的 selectById
        SysUser user = sysUserMapper.selectById(id);
        if (user == null) {
            return Result.error(100404, "用户不存在");
        }

        // 2. 将状态设置为 1 (启用)
        user.setStatus(1);
        user.setUpdateTime(LocalDateTime.now());

        // 3. 复用你刚写好的 updateById
        sysUserMapper.updateById(user);

        // 4. 返回接口文档要求的格式
        Map<String, Integer> resultMap = new HashMap<>();
        resultMap.put("status", 1);
        return Result.success(resultMap);
    }

    @Override
    public Map<String, Object> getUserList(Integer current, Integer size, String username, String realName, String phone, Integer status) {
        // 默认值处理
        int currentPage = (current == null || current < 1) ? 1 : current;
        int pageSize = (size == null || size < 1) ? 10 : size;
        int offset = (currentPage - 1) * pageSize;

        // 1. 查询总数
        long total = sysUserMapper.countUserList(username, realName, phone, status);

        // 2. 查询列表数据
        List<SysUser> records = sysUserMapper.selectUserList(username, realName, phone, status, offset, size);

        // 3. 组装返回结果结构
        Map<String, Object> result = new HashMap<>();
        result.put("total", total);
        result.put("pages", (total + pageSize - 1) / pageSize); // 计算总页数
        result.put("current", currentPage);
        result.put("size", pageSize);
        result.put("records", records);

        return result;
    }


    @Override
    public Result<Void> logout(Long userId) {
        // 1. 拼接 Redis 中的 Key
        String redisKey = "login:token:" + userId;

        // 2. 删除对应的 Token 记录，使其失效
        redisTemplate.delete(redisKey);

        // 3. 返回图 5.2.5 要求的格式
        return Result.success(null);
    }
    @Override
    public Result<LoginVO> login(LoginDTO loginDTO) {
        // 1. 查询用户
        SysUser user = sysUserMapper.selectByUsername(loginDTO.getUsername());

        // 2. 校验密码
        if (user == null || !passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            return Result.error(100400, "用户名或密码错误");
        }

        // 3. 更新登录时间
        sysUserMapper.updateLastLoginTime(user.getId(), LocalDateTime.now());

        // 4. 生成 JWT Token
        String token = JwtUtil.createToken(user.getId(), user.getUsername());

        // ======= 新增 Redis 逻辑 =======
        // 将 Token 存入 Redis，Key 格式为 login:token:userId
        // 这样可以方便后续做“单点登录”或“强制下线”
        String redisKey = "login:token:" + user.getId();
        System.out.println("准备存入 Redis, Key: " + redisKey);
        redisTemplate.opsForValue().set(redisKey, token, 7200, TimeUnit.SECONDS);
        System.out.println("Redis 存入成功！");
        // ==============================

        // 5. 组装返回数据
        LoginVO.UserInfoVO userInfoVO = LoginVO.UserInfoVO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .realName(user.getRealName())
                .status(user.getStatus())
                .build();

        LoginVO loginVO = LoginVO.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(7200L)
                .userInfo(userInfoVO)
                .build();

        return Result.success(loginVO);
    }
    @Override
    public Result<Map<String, String>> updateUser(UserUpdateDTO updateDTO) {
        // 1. 执行更新
        int rows = sysUserMapper.updateUserInfo(updateDTO);

        if (rows > 0) {
            // 2. 组装返回数据
            DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            Map<String, String> data = new HashMap<>();
            data.put("update_time", df.format(LocalDateTime.now()));

            return Result.success(data);
        }
        return Result.error(100400, "更新失败，用户不存在");
    }


}
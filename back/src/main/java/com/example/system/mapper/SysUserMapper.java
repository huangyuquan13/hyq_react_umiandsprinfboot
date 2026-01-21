package com.example.system.mapper;

import com.example.system.dto.request.UserUpdateDTO;
import com.example.system.entity.SysUser;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface SysUserMapper {

//停用启用
@Select("SELECT id, username, password, phone, real_name, status, create_time, update_time, last_login_time " +
        "FROM sys_user WHERE id = #{id}")
    SysUser selectById(Long id);
    // 2. 根据 ID 更新状态和更新时间
    @Update("UPDATE sys_user SET status = #{status}, update_time = #{updateTime} WHERE id = #{id}")
    int updateById(SysUser user);
//更新最后登录时间
    @Update("UPDATE sys_user SET last_login_time = #{lastLoginTime} WHERE id = #{id}")
    int updateLoginTime(@Param("id") Long id, @Param("lastLoginTime") LocalDateTime lastLoginTime);



    /**
     * 根据用户名查询用户详细信息
     */
    @Select("SELECT id, username, password, phone, real_name, status, create_time, update_time, last_login_time " +
            "FROM sys_user WHERE username = #{username}")
    SysUser selectByUsername(@Param("username") String username);
    /**
     * 新增用户 (添加这一行)
     * @param sysUser 用户实体
     * @return 影响行数
     */
    @Insert("INSERT INTO sys_user(username, password, real_name, phone, status, create_time) " +
            "VALUES(#{username}, #{password}, #{realName}, #{phone}, #{status}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id") // 这行代码负责把生成的 ID 填回对象
    int insert(SysUser sysUser);

    /**
     * 条件查询用户列表（带分页）
     */
    @Select("<script>" +
            "SELECT * FROM sys_user " +
            "<where>" +
            "  <if test='username != null and username != \"\"'> " +
            "    AND username LIKE CONCAT('%', #{username}, '%') " +
            "  </if>" +
            "  <if test='realName != null and realName != \"\"'> " +
            "    AND real_name LIKE CONCAT('%', #{realName}, '%') " +
            "  </if>" +
            "  <if test='phone != null and phone != \"\"'> " +
            "    AND phone = #{phone} " +
            "  </if>" +
            "  <if test='status != null'> " +
            "    AND status = #{status} " +
            "  </if>" +
            "</where>" +
            "LIMIT #{offset}, #{size}" +
            "</script>")
    List<SysUser> selectUserList(@Param("username") String username,
                                 @Param("realName") String realName,
                                 @Param("phone") String phone,
                                 @Param("status") Integer status,
                                 @Param("offset") int offset,
                                 @Param("size") int size);

    /**
     * 查询符合条件的总记录数（用于分页计算）
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM sys_user " +
            "<where>" +
            "  <if test='username != null and username != \"\"'> AND username LIKE CONCAT('%', #{username}, '%') </if>" +
            "  <if test='realName != null and realName != \"\"'> AND real_name LIKE CONCAT('%', #{realName}, '%') </if>" +
            "  <if test='phone != null and phone != \"\"'> AND phone = #{phone} </if>" +
            "  <if test='status != null'> AND status = #{status} </if>" +
            "</where>" +
            "</script>")
    long countUserList(@Param("username") String username,
                       @Param("realName") String realName,
                       @Param("phone") String phone,
                       @Param("status") Integer status);
    /**
     * 更新用户最后登录时间
     */
    @Update("UPDATE sys_user SET last_login_time = #{loginTime} WHERE id = #{id}")
    void updateLastLoginTime(@Param("id") Long id, @Param("loginTime") LocalDateTime loginTime);

    @Update("<script>" +
            "UPDATE sys_user " +
            "<set>" +
            "  <if test='realName != null and realName != \"\"'> real_name = #{realName}, </if>" +
            "  <if test='phone != null and phone != \"\"'> phone = #{phone}, </if>" +
            "  <if test='status != null'> status = #{status}, </if>" +
            "  update_time = NOW() " +
            "</set>" +
            "WHERE id = #{id}" +
            "</script>")
    int updateUserInfo(UserUpdateDTO userUpdateDTO);


}
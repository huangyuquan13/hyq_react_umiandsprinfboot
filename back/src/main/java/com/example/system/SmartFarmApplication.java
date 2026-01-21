package com.example.system;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.system.mapper") // 扫描 Mapper 接口
public class SmartFarmApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartFarmApplication.class, args);
    }
}
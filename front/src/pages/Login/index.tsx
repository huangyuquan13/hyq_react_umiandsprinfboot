import {useState} from 'react';
import { request, useNavigate } from '@umijs/max';
import { Table,Form,Input,Button,message  } from 'antd';
import { useModel } from '@umijs/max';
import {LoginApi,refreshLoginTime} from '@/services/Login/login'

const Login = ()=>{
    //获取表单实例
    const [form] = Form.useForm();
    const go = useNavigate();
    //获取登录的全局定义的方法 好动态的修改用户名
    const { setInitialState } = useModel('@@initialState');
    
    const handLogin = async (values)=>{
         //触发校验 先检验rules规则再取表单中所有的name键值为对象
        console.log('校验通过，登录信息：', values);
        //调用登录接口
        const res = await LoginApi(values);
        console.log(res.data.token);

        //将token存储到localStorage
        localStorage.setItem('token', res.data.token);
        //JSON.stringify()将对象转换为字符串
        // JSON.parse(localStorage.getItem('user'));取出的为对象
        //将输入框登录的username存储到localStorage
        localStorage.setItem('username', values.username);
        //主动修改
        setInitialState({ name: values.username });
        
        // 校验通过后再跳转
         go('/home');
    }
    return(<>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
         <Form form={form} onFinish={handLogin}>
            {/* 表单输入布局 */}
            <Form.Item label="账号登录" style={{width:'500px'}}   name="username"
            rules={[
            { required: true, message: '请输入账号！' },
            { max: 20, message: '账号最长不能超过20个字符！' }
          ]}
            >
                <Input placeholder="请输入账号"/>
            </Form.Item>
            <Form.Item label="密码" style={{width:'500px'}}   name="password"
             rules={[
            { required: true, message: '请输入密码！' },
            { max: 20, message: '密码最长不能超过20个字符！' }
          ]}
            >
                <Input type="password" placeholder="请输入密码"/>
            </Form.Item>
            <Form.Item >
                <Button type="primary" htmlType="submit">登录</Button>
            </Form.Item>

        </Form>

        </div>

           
    </>)
}
export default Login;
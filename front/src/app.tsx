// 运行时配置
import { message } from 'antd';
import logo from '@/assets/logo.png';
import { history, RequestConfig, useModel } from  '@umijs/max';

// 1. 初始化全局状态 这里是页面加载中执行一次
export async function getInitialState(): Promise<{ name: string }> {
   const username = localStorage.getItem('username') || '张三';
  return { name: username };
}

// 2. 路由拦截器：未登录/禁用跳转登录页
export const onRouteChange = ({location}) =>{
  //定义不用拦截的路由 数组
  const whiteList = ['/login'];
  //判断当前的location路由对象是否是白名单中的
  //数组方法includes()  判断数组中是否包含某个元素  返回布尔值
  //有的话返回true 并直接return结束放行 否则直接token判断
  if(whiteList.includes(location.pathname)){
    return;
  }
  //判断本地是否存在token ，是否登录
  const token = localStorage.getItem('token');
  if(!token){
    //如果不存在token ，说明用户未登录，跳转到登录页
    message.error('请先登录');
    history.push('/login');
    return;
  }
}

export const layout = () => {
  //在layout中获取setInitialState
   const { setInitialState } = useModel('@@initialState');
  return {
    logo: logo,
    menu: {
      locale: false,
    },
    title: '智能农业管理系统',
    layout: 'mix',
    

      logout: () => {
      console.log('退出登录');
      localStorage.clear(); 
      //主动修改用户名
      setInitialState({ name: '张三' });
      history.replace('/login');
       message.success('退出成功');
    } 
  };
  

};

//3.请求/响应拦截
export const request:RequestConfig = {
  baseURL: '/api',//统一的接口前缀，用于proxy代理的时候方便统一管理
  timeout: 30000,//请求超时时间
  /**
   * 请求头配置
   */
  headers: {
    'Content-Type': 'application/json',
  },
  /**
   * 3.1请求拦截器，携带token 出
   */
  requestInterceptors: [
    //请求拦截器是一个数组，数组中每一个函数 ，代表一个拦截器，
    // 拦截器的参数  url  表示页面请求地址；options表示请求的其他配置项
    (url: string, options: any) => {

      //将登录返回的用户凭证--token 在这里统一的添加到请求中
      // 1.从本地储存中获取用户凭据-token 
       const token = localStorage.getItem('token')
       console.log('app中看登录的token',token);
       
      //把token添加到请求中 ，在请求的配置参数中把token添加进去
      if (token) {//判断本地时候存在token ，是否登录
        //只有登录后，才给请求添加token
        const headers = {
          ...options.headers,
          Authorization: ` ${token}`,//Authorization 不是绝对固定的，这个是后端来定义和决定
        };
        return {
          url,
          options: { ...options, headers },
        };
      }

      return {
        url,
        options: { ...options, interceptors: true },
      };
    },
  ],
  /**
   * 响应拦截器 统一处理登录相关错误 进
   */
  responseInterceptors: [
    (response: any) => {//统一的错误提示处理
      // 拦截响应数据，进行个性化处理
      // 解构化拿取数据
       const { data } = response;
       console.log('响应数据',data);
       if (data.code !== 100200){
        message.error(data.message);
        throw data.message;
       }
      //数据正常 直接返回
      return response;
    },
  ],
  /**
   * 错误处理
   */
  errorConfig: {
    // 错误处理
    errorHandler: (error:any) => {
      console.log(error);
   
    
  },}
};

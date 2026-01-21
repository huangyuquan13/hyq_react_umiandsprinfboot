import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  mock:false,
  layout: {
    title: '智慧养殖系统',
  },
  proxy: {
    '/api': {
      'target': 'http://10.159.33.142:8080',  // 后端地址
      'changeOrigin': true,
      'pathRewrite': { '^/api': '/api' },  // 根据实际情况调整
    },
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
     {
      name: ' 基础配置',
      path: '/config',
      routes: [
        {
          name: ' 数字字典',
          path: '/config/Dictionary',
          // component: './Dictionary',
          routes:[
           {
            name: '牲畜品种',
            path: '/config/Dictionary/Breed',
            component: './Dictionary/Breed',
          },
          {
            name: '牲畜类型',
            path: '/config/Dictionary/Type',
            component: './Dictionary/Type',
          },
          {
            name: '出栏类型',
            path: '/config/Dictionary/BreedType',
            component: './Dictionary/BreedType',
          },
          {
            name: '喂养方案',
            path: '/config/Dictionary/FeedScheme',
            component: './Dictionary/FeedScheme',
          },
            {
            name: '喂养方式',
            path: '/config/Dictionary/FeedPlay',
            component: './Dictionary/FeedPlay',
          },
            {
            name: '免疫类型',
            path: '/config/Dictionary/ImmunityType',
            component: './Dictionary/ImmunityType',
          },
            {
            name: '免疫方案',
            path: '/config/Dictionary/ImmunityScheme',
            component: './Dictionary/ImmunityScheme',
          },
            {
            name: '免疫方式',
            path: '/config/Dictionary/ImmunityPlay',
            component: './Dictionary/ImmunityPlay',
          },
            {
            name: '疾病类型',
            path: '/config/Dictionary/DiseaseType',
            component: './Dictionary/DiseaseType',
          },
            {
            name: '保健类型',
            path: '/config/Dictionary/HealthType',
            component: './Dictionary/HealthType',
          },
          {
            name: '保健项目',
            path: '/config/Dictionary/HealthItem',
            component: './Dictionary/HealthItem',
          },
          {
            name: '保健方式',
            path: '/config/Dictionary/HealthPlay',
            component: './Dictionary/HealthPlay',
          },
          {
            name: '消毒类型',
            path: '/config/Dictionary/SanitationType',
            component: './Dictionary/SanitationType',
          },
          {
            name: '消毒项目',
            path: '/config/Dictionary/SanitationItem',
            component: './Dictionary/SanitationItem',
          },
          {
            name: '消毒方案',
            path: '/config/Dictionary/SanitationScheme',
            component: './Dictionary/SanitationScheme',
          },
          {
            name: '消毒方式',
            path: '/config/Dictionary/SanitationPlay',
            component: './Dictionary/SanitationPlay',
          }
          ]
          
        },
        {
          name: ' 人员管理',
          path: 'Manager',
          component: './Manager',
        }
      ]
    },
     {
      name: '登录',
      path: '/login',
      component: './Login',
      layout: false,
    },
    
  ],
  npmClient: 'pnpm',
});


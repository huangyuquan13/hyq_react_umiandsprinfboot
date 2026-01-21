const users = [
  { id: 0, name: 'Umi', nickName: 'U', gender: 'MALE' },
  { id: 1, name: 'Fish', nickName: 'B', gender: 'FEMALE' },
];

export default {
  'GET /api/v1/queryUserList': (req: any, res: any) => {
    res.json({
      success: true,
      data: { list: users },
      errorCode: 0,
    });
  },
  'PUT /api/v1/user/': (req: any, res: any) => {
    res.json({
      success: true,
      errorCode: 0,
    });
  },
//  'POST /v1/sys-user/login': (req: any, res: any) => {
//     res.json({
//       success: true,
//       errorCode: 100200,
//       data: {
//         token: 'eyJhbGciOiJIUzI1NiJ9.eyJyZWFsTmFtZSI6IuWlsOaZkyIsImlkIjoxfQ...',
//         tokenHead: 'Bearer ',
//         userInfo: { id: 1, username: req.body.username, realName: '系统管理员' }
//       }
//     });
//   },
};

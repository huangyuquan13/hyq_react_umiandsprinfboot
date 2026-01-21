import { request } from '@umijs/max';

// 登录
// 修改说明：登录时不需要传 Token，也不需要读取 localStorage，保持纯净
export async function LoginApi(data: any) {
  return request('/v1/user/login', {
    method: 'POST',
    data,
  });
}

// 查询
export async function getSearch(data: any) {
  return request('/v1/user/list', {
    method: 'GET',
    params: data,
  });
}

// 新增
export async function addPerson(data: any) {
  return request('/v1/user/add', {
    method: 'POST',
    data,
  });
}

// 修改
export async function updatePerson(data: any) {
  return request(`/v1/user/update`, {
    method: 'PUT',
    data: data,
  });
}

// 停用/启用用户
export async function toggleUserStatus(id: number, isEnable: boolean) {
  const url = isEnable 
    ? `/v1/user/enable?id=${id}` 
    : `/v1/user/disable?id=${id}`;
  return request(url, {
    method: 'PUT',
  });
}

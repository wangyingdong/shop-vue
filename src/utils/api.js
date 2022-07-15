// 封装页面请求
import http from '../utils/http'

//
export function usersLogin(params) {
  return http.post('/users/login', params)
}

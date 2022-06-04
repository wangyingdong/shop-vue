import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8888/',
  timeout: 5000
})

// 请求拦截
instance.interceptors.request.use(
  function (config) {
    let token = sessionStorage.getItem('token')
    console.log('token:' + token)
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  function (err) {
    return Promise.reject(err)
  }
)

// 响应拦截
instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (err) {
    return Promise.reject(err)
  }
)

export function get(url, params) {
  return instance.get(url, {
    params
  })
}

export function post(url, data) {
  return instance.post(url, data)
}

export function del(url) {
  return instance.del(url)
}

export function put(url, data) {
  return instance.put(url, data)
}

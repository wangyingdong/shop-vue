import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

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

import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: `systcb?t=${new Date().getTime()}`,
    data:{
      type:"login",
      data
    },
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: `systcb?t=${new Date().getTime()}`,
    data:{
      type:"userInfo",
      token
    },
    method: 'post'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

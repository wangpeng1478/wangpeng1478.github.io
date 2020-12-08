import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}


export const Systcb = (data) => {
  return axios.request({
    url: `systcb?t=${new Date().getTime()}`,
    data,
    method: 'post'
  })
}

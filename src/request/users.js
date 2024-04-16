import api from '.'

export const get_users = (q) => api.get(`/api/users?${q}`)

export const login = data => api.post('/api/login', data)

export const get_users_counts = () => api.get('/api/users/count')

export const create_user = userdata => api.post('/api/users', userdata)

export const edit_user = (id, userdata) => api.put('/api/users'+id, userdata)

export const delete_user = id => api.delete('/api/users'+id)
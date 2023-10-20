import api from './'

export const get_users = () => api.get('/auth/users')

export const login = data => api.post('/auth/jwt/create/', data)

export const get_me = token => api.get('/api/v1/users/me/', { headers: { Authorization: `Bearer ${token}` } })

export const get_users_counts = () => api.get('/auth/users')

export const create_user = userdata => api.post('/auth/users/', userdata)

export const edit_user = (id, userdata) => api.put('/users/'+id, userdata)

export const delete_user = id => api.delete('/auth/users/'+id)
import api from '.'

export const get_posts = q => api.get(`/api/posts?${q}`)

export const get_posts_by_id = id => api.get(`/api/post/${id}/`)

export const get_posts_count = () => api.get(`/api/posts/count`)

export const get_posts_pub_count = () => api.get(`/api/posts/pub_count`)

export const by_month_posts = q => api.get(`/api/posts/month_count?${q}`)

export const create_post = data => api.post(`/api/posts`, data)

export const create_post_telegram = data => api.post(`/api/posts/telegram`, data)

export const edit_posts = (id, data) => api.put(`/api/post/${id}`, data)

export const toggle_posts = (id, is_published) => api.put(`/api/post/toggle/${id}`, { is_published })

export const delete_post = id => api.delete(`/api/posts/${id}`)
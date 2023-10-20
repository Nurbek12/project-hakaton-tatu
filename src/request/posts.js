import api from './'

export const get_posts = q => api.get(`/api/v1/posts?${q}`)

export const get_posts_by_id = id => api.get(`/api/v1/posts/${id}/`)

export const get_posts_count = () => api.get(`/api/v1/posts-count/`)

export const get_posts_pub_count = () => api.get(`/api/v1/posts-pub-count`)

export const by_month_posts = q => api.get(`/api/v1/posts-in-month?${q}`)

export const create_post = data => api.post(`/api/v1/posts/create/`, data)

export const edit_posts = (id, data) => api.put(`/api/v1/posts/${id}`, data)

export const toggle_posts = (id, is_published) => api.put(`/api/v1/posts-publish/${id}`, { is_published })

export const delete_post = id => api.delete(`/api/v1/posts/${id}`)
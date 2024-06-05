import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { PostControllers, UserControllers } from './controllers.js'

const middleware = (req, res, next) => {
    const { authorization } = req.headers
    const token = authorization?.replace('Bearer ', '')
    if(!token) return res.status(401).json(false)
    jwt.verify(token, "secret_token", (err, user) => {
        if(err) return res.status(401).json(false)
        req.user = user
        next()
    })
}

export default Router()
    .get('/users', middleware, UserControllers.get_users)
    .get('/users/count', middleware, UserControllers.get_users_counts)
    .post('/users', middleware, UserControllers.create_user)
    .put('/users/:id', middleware, UserControllers.edit_user)
    .delete('/users/:id', middleware, UserControllers.delete_user)
    .post('/login', UserControllers.login)

    .get('/posts', PostControllers.get_posts)
    .get('/post/:id', middleware, PostControllers.get_posts_by_id)
    .get('/posts/count', middleware, PostControllers.get_posts_count)
    .get('/posts/pub_count', middleware, PostControllers.get_posts_pub_count)
    .get('/posts/month_count', middleware, PostControllers.get_posts_month_count)
    
    .post('/posts', middleware, PostControllers.create_post)
    .post('/posts/telegram', middleware, PostControllers.send_telegram)
    .put('/posts/:id', middleware, PostControllers.edit_post)
    .put('/post/toggle/:id', middleware, PostControllers.toggle_post)
    .delete('/posts/:id', middleware, PostControllers.delete_post)
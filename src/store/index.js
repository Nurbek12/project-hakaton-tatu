import { createStore } from 'vuex'
import Cookies from 'js-cookie'

export default createStore({
    state: {
        user: JSON.parse(localStorage.getItem('user') || '{}'),
        token: Cookies.get('token') || '',
    },
    getters: {
        user: state => state.user,
        token: state => state.token,
        logged: state => !!state.token,
        role: state => state.user?.role || '',
        userid: state => state.user?.id || '',
    },
    actions: {
        
    },
    mutations: {
        logout(state){
            state.token = ''
            state.user = {}
            localStorage.removeItem('user')
            Cookies.remove('token')
            window.location.href = '/login'
        },
        setUser(state, user){
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
        setToken(state, token){
            state.token = token
            const expires = new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
            Cookies.set('token', token, { expires })
        },
    }
})
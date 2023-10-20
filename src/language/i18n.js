import { createI18n } from 'vue-i18n'
import * as dashboard from './dashboard'
import * as posts from './posts'
import * as navigation from './navigation'
import * as form from './form'

export default new createI18n({
    locale: localStorage.getItem('dashboard-lang') || 'en',
    legacy: false,
    globalInjection: true,
    messages: {
        en: {
            nav: navigation.en,

            dashboard: dashboard.en,

            posts: posts.en,

            form: form.en,

            login: {
                login: "Login",
                password: "Password",
                submit: "Sign In",
                title: "HOTEL MANAGEMENT",
                incorrect: "Login or Password incorrect"
            },

            delete_confirm_text: "Are you sure you want to delete this item?",
            search: "Search",
            actions: "Actions",
            save: "Save",
            nodata: "No data available",
            loaditems: "Loading items..."
        },
        ru: {
            nav: navigation.ru,

            dashboard: dashboard.ru,

            posts: posts.ru,

            form: form.ru,

            login: {
                login: "Логин",
                password: "Пароль",
                submit: "Войти в систему",
                title: "УПРАВЛЕНИЕ ОТЕЛЬЯ",
                incorrect: "Неверный логин или пароль"
            },
            delete_confirm_text: "Вы согласны что удалить это элемент?",
            search: "Поиск",
            actions: "Управления",
            save: "Сохранить",
            nodata: "Данные недоступны",
            loaditems: "Загрузка данные..."
        },
        uz: {
            nav: navigation.uz,

            dashboard: dashboard.uz,

            posts: posts.uz,

            form: form.uz,

            login: {
                login: "Login",
                password: "Parol",
                submit: "Tizimga kirish",
                title: "MEHMONXONA BOSHQARUVI",
                incorrect: "Login yoki Parol noto'g'ri"
            },
            
            delete_confirm_text: "Bu ma'lumotni o'chirishga rozimisiz?",
            search: "Qidirish",
            actions: "Boshqarish",
            save: "Saqlash",
            nodata: "Maʼlumotlar mavjud emas",
            loaditems: "Yuklash jarayonida..."
        }
    }
})
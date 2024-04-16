import { Schema, model } from 'mongoose'

export const User = model('p-users', new Schema({
    name: String,
    login: String,
    password: String,

    role: {
        type: String,
        enum: ['admin','user'],
        default: 'user'
    }
}, {
    timestamps: true
}))

export const Post = model('p-posts', new Schema({
    title_uz: String,
    title_ru: String,
    title_en: String,
    
    description_uz: String,
    description_ru: String,
    description_en: String,

    content_uz: String,
    content_ru: String,
    content_en: String,

    cover: String,
    public: {
        type: Boolean,
        default: false
    },

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'p-users'
    },

    date: String
}, {
    timestamps: true
}))
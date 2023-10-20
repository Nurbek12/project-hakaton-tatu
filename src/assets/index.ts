interface IUser {
    email: string
    password: string
    name: string

    role: 'user' | 'admin'
}

interface IPost {
    title: string
    
    content: string

    creater: IUser

    date: string

    publish: boolean
}
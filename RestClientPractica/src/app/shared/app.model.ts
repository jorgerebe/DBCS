export interface User {
    id: Number,
    name: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    enabled: boolean,
    role: Role,
    createdAt: Date,
    updatedAt: Date
    }

export enum Role{
    HOST = 'HOST',
    GUEST = 'GUEST'
}
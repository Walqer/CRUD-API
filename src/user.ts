import { isValidUserData } from './helpers/validateUser'
import { User } from './types/User'
import { validate, v4 as uuid } from 'uuid'
export class InvalidUserIdError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'InvalidUserIdError'
    }
}

export class UserNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserNotFoundError'
    }
}
const validateUser = (user: User) => {
    const schema = {
        type: 'object',
        properties: {
            age: { type: 'integer' },
            hobbies: { type: 'array', items: { type: 'string' } },
            username: { type: 'string' },
        },
    }
}
const users: User[] = []

export const getUsers = () => {
    return users
}

export const getUserById = (id: string) => {
    if (!validate(id)) throw new InvalidUserIdError('Invalid user ID format')
    const user = users.find((user) => user.id === id)
    if (!user) throw new UserNotFoundError('User not found')
    return user
}

export const createUser = (data: Omit<User, 'id'>) => {
    const isValid = isValidUserData(data)
    if (isValid) {
        const newUser = {
            id: uuid(),
            ...data,
        }
        users.push(newUser)
        return newUser
    }
}

export const updateUser = (id: string, data: Omit<User, 'id'>) => {
    if (!validate(id)) throw new InvalidUserIdError('Invalid user ID format')
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) throw new UserNotFoundError('User not found')
    const isValid = isValidUserData(data)
    if (isValid) {
        const updatedUser = {
            id,
            ...data,
        }
        users[userIndex] = updatedUser
        return updatedUser
    }
}

import { User } from './types/User'
import { validate } from 'uuid'
const users: User[] = []

export const getUsers = () => {
    return users
}

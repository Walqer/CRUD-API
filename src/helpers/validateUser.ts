import { User } from '../types/User'

export const isValidUserData = (userData: Omit<User, 'id'>) => {
    const errors = []

    if (!userData.username || typeof userData.username !== 'string') {
        errors.push('Username must be a string with at least 1 character.')
    }

    if (
        typeof userData.age !== 'number' ||
        userData.age <= 0 ||
        !Number.isInteger(userData.age)
    ) {
        errors.push('Age must be a non-negative integer.')
    }

    if (
        !Array.isArray(userData.hobbies) ||
        !userData.hobbies.every((hobby) => typeof hobby === 'string')
    ) {
        errors.push('Hobbies must be an array of strings.')
    }

    if (errors.length > 0) {
        throw new Error(errors.join(' '))
    }

    return true
}

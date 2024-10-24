import supertest from 'supertest'
import { server } from '../index'
import { validate, v4 as uuid } from 'uuid'
import { faker } from '@faker-js/faker'
const request = supertest(server)
describe('User API tests', () => {
    beforeAll(() => {
        server.close()
        server.listen(4000)
    })
    afterAll(() => {
        server.close()
    })
    const userData = {
        username: 'John Doe',
        age: 30,
        hobbies: ['reading', 'writing'],
    }
    const updatedUserData = {
        username: 'Jane Doe',
        age: 40,
        hobbies: ['reading', 'writing', 'coding', 'family', 'friends'],
    }
    let createdUserId: string
    it('should return 200 and an empty array on GET /api/users', async () => {
        const { status, body } = await request.get('/api/users')
        expect(status).toBe(200)
        expect(body).toStrictEqual([])
    })
    it('A new object is created by a POST api/api/users request', async () => {
        const { status, body } = await request.post('/api/users').send(userData)
        expect(status).toBe(201)
        expect(validate(body.id)).toBe(true)
        createdUserId = body.id
        expect(body).toEqual({ id: expect.any(String), ...userData })
    })
    it('should return user on GET /api/users/:id', async () => {
        const { status, body } = await request.get(
            `/api/users/${createdUserId}`
        )
        expect(status).toBe(200)
        expect(body).toEqual({ id: createdUserId, ...userData })
    })
    it('should update user on PUT /api/users/:id', async () => {
        const { status, body } = await request
            .put(`/api/users/${createdUserId}`)
            .send(updatedUserData)
        expect(status).toBe(200)
        expect(body).toEqual({ id: createdUserId, ...updatedUserData })
    })
    it('should delete user on DELETE /api/users/:id', async () => {
        const { status } = await request.delete(`/api/users/${createdUserId}`)
        expect(status).toBe(204)
    })
    it('should return 404 on GET /api/users/:id', async () => {
        const { status } = await request.get(`/api/users/${createdUserId}`)
        expect(status).toBe(404)
    })
})

describe('Error handling', () => {
    it('should return 400 on invalid ID', async () => {
        const { status } = await request.get('/api/users/123')
        expect(status).toBe(400)
    })
    it('should return 404 on GET /api/users/:id', async () => {
        const { status } = await request.get(`/api/users/${uuid()}`)
        expect(status).toBe(404)
    })
    it('should return 404 on DELETE /api/users/:id', async () => {
        const { status } = await request.delete(`/api/users/${uuid()}`)
        expect(status).toBe(404)
    })
    it('should return 404 on PUT /api/users/:id', async () => {
        const { status } = await request.put(`/api/users/${uuid()}`).send({
            id: uuid(),
            username: 'John Doe',
            age: 30,
            hobbies: ['reading', 'writing'],
        })
        expect(status).toBe(404)
    })
    it('should return 400 on POST /api/users with invalid data', async () => {
        const { status } = await request.post('/api/users').send({
            username: 'John Doe',
            age: '30',
            hobbies: ['reading', 'writing'],
        })
        expect(status).toBe(400)
    })
})

describe('Table tests', () => {
    const randomUsers = Array.from({ length: 100 }, () => ({
        username: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 100 }),
        hobbies: faker.helpers.arrayElements(
            ['reading', 'writing', 'sports', 'music', 'traveling'],
            2
        ),
    }))
    const randomUsersWithId: (typeof randomUsers & { id: string })[] = []
    it.each(randomUsers)('should create user with %j', async (user) => {
        const { status, body } = await request.post('/api/users').send(user)
        expect(status).toBe(201)
        randomUsersWithId.push(body)
    })

    it('should get all users', async () => {
        const { status, body } = await request.get('/api/users')
        expect(status).toBe(200)
        expect(body).toEqual(randomUsersWithId)
    })

    it('should delete all users', async () => {
        for (const user of randomUsersWithId) {
            const { status } = await request.delete(`/api/users/${user.id}`)
            expect(status).toBe(204)
        }
    })

    it('should get all users', async () => {
        const { status, body } = await request.get('/api/users')
        expect(status).toBe(200)
        expect(body).toEqual([])
    })
})

import supertest from 'supertest'
import { server } from '../index'
const request = supertest(server)
describe('User API tests', () => {
    beforeAll(() => {
        server.close()
        server.listen(4000)
    })
    afterAll(() => {
        server.close()
    })
    it('should return 200 and an empty array on GET /users', async () => {
        const { status, body } = await request.get('/users')
        expect(status).toBe(200)
        expect(body).toStrictEqual([])
    })
})

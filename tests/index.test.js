import {axios} from "axios"


//Backend Server url
const BACKEND_URL = "https://localhost:3000"

describe("Authentication", () => {

    test("User is able to signup only once ",async() => {
        const username = `Ansh-${Math.random()}`
        const password = '123456'

        const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
             username,
             password,
             type : "admin"
        })

        expect(response.statusCode).toBe(200)

        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
             username,
             password,
             type : "Admin"
        })

        expect(response.statusCode).toBe(400)
    })

    test("signup request fails if the user is empty",async () => {
        password = '123456789'

        const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
            password
        })

        expect(response.statusCode).toBe(403)
    })

    test("signin succeeds if the username and password is correct" , async()=>{
        const username = `Ansh-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
            username,
            password
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
            username,
            password
        })
        expect(response.statusCode).toBe(200)
        expect(response.data.token).toBeDefined()
    })
})
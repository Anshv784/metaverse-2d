const axios = require("axios")

//Backend Server url
const BACKEND_URL = "https://localhost:3000"

// Ensure that signup and signin end point is able to return back a user id...[write tests later]
describe("Authentication", () => {

    test("User is able to signup only once ",async() => {
        const username = `Ansh-${Math.random()}`
        const password = '123456'

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
             username,
             password,
             type : "admin"
        })

        expect(response.statusCode).toBe(200)

        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
             username,
             password,
             type : "Admin"
        })

        expect(response.statusCode).toBe(400)
    })

    test("signup request fails if the user is empty",async () => {
        password = '123456789'

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            password
        })

        expect(response.statusCode).toBe(403)
    })

    //sign in end point must return a token
    test("signin succeeds if the username and password is correct" , async()=>{
        const username = `Ansh-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })
        expect(response.statusCode).toBe(200)
        expect(response.data.token).toBeDefined()
    })
    
    test("signup fails if the username and password are incorrect",async () =>{
        const username = `Ansh-${Math.random()}`
        const password = 123456

        await axios.post(`${BACKEND_URL}/api/v1/signup`)

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username : "wrongUsername",
            password : "wrong password"
        })

        expect(response.statusCode).toBe(403)
    })
})

describe("get user metadata",() => {
    let token;
    let avatarId;
    let userId;
    beforeAll(async () => {
        const username = `Ansh-${Math.random()}`
        const password = 123456

        const signupResponse = await axios.post(`${BACKEND_URL}/api/vi/signup`,{
            username,
            password,
            type : "Admin"
        })
        
        userId = signupResponse.data.userId

        const signinResponse = await axios.post(`${BACKEND_URL}/api/vi/signin`,{
            username,
            password
        })

        token = signinResponse.data.token

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imgageUrl" : "ImageUrl",
            "name" : "Timmy"
        })

        avatarId = avatarResponse.data.avatarId

    })

    test("user can't update their metadata with wrong avatar id", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId : "123456"
        },{
            headers : {
                "authorization" : `Bearer ${token}`
            }
        })

        expect(response.statusCode).toBe(400)
    })

    test("user can able to update their metadata with right avatar id " ,async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId : avatarId
        },{
            headers : {
                "authorization" : `Bearer ${token}`
            }
        })
        
        expect(response.statusCode).toBe(200)
    })

    test("user forgets to send their authorization header" ,async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId : avatarId
        })
        
        expect(response.statusCode).toBe(403)
    })
})

describe("Get others user metadata",() => {
    let token;
    let avatarId;
    let userId;

    beforeAll(async () => {
        const username = `Ansh-${Math.random()}`
        const password = 123456

        const signupResponse = await axios.post(`${BACKEND_URL}/api/vi/signup`,{
            username,
            password,
            type : "Admin"
        })

        userId = signupResponse.data.userId

        const signinResponse = await axios.post(`${BACKEND_URL}/api/vi/signin`,{
            username,
            password
        })

        token = signinResponse.data.token

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imgageUrl" : "ImageUrl",
            "name" : "Timmy"
        })

        avatarId = avatarResponse.data.avatarId

    })

    test("getback avatar information for a user" , async() => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`)
        expect(response.data.avatars.length).toBe(1)
        expect(response.data.avatars[0].userId).toBeDefined();
    })

    test("Available avatars list the recently created avatars" , async() => {
        const reponse = await axios.get(`${BACKEND_URL}/api/v1/avatars`)
        expect(response.data.avatars.length).not.toBe(0)
        const currentAvatar = response.data.avatars.find(x => x.id == avatarId)
        expect(currentAvatar).toBeDefined()
    })
})
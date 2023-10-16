import axios from 'axios'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { userModel } from './models/userSchema.js'

dotenv.config()

// Base URL of the API
const baseUrl = 'http://localhost:3000'
var userId, token

// MongoDB configuration
const db = process.env.DB_URL

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB')
})


// Function to perform a POST request to add a new person
async function registerUser(username, email, password) {
    try {
        const response = await axios.post(`${baseUrl}/signup`, { username, email, password })
        console.log('Registration Successful:', response.data)
        return response.data
    } catch (error) {
        console.error('Registration Failed:', error)
    }
}
///Function to perform a GET request to get user
async function login(email, password) {
    try {
        const response = await axios.post(`${baseUrl}/login`, { email, password })
        console.log('Login Successful:', response.data)
        userId = response.data._id
        token = response.data.user.token
        console.log('Token:', token)
    } catch (error) {
        console.error('Login Failed:', error)
    }
}


// Function to perform a POST request to send file to an email
async function sendFile(email, filename) {
    try {
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
        console.log('Token:', token)
        const response = await axios.post(`${baseUrl}/sendfile`, { email, filename }, { headers })
        console.log('File Sent:', response.data)
        return response.data
    } catch (error) {
        console.error('Failed Send:', error)
    }
}


async function testAPI() {
    //   await registerUser('Jane Doe','jane@gmail.com','000000')
    await login('jane@gmail.com', '000000')

    await sendFile('lindapomaa27@gmail.com', 'Man_United.png')
}

testAPI()
import axios from 'axios'

const host = '192.168.100.121'
const port = '3333'

export const api = axios.create({
    baseURL: `http://${host}:${port}`
})
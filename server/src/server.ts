import express from 'express'
import path from 'path'
import dotenv from 'dotenv'

import { getCollections } from './db'

const app: express.Application = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, '/../../client-dist')))
const PORT = 8080

dotenv.config({ path: '../..' })

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../../client-dist/index.html'))
})

const checkEnvVars = () => {
    let hasProps = (
        'RSA_PRIVATE_KEY' in process.env &&
        'RSA_PUBLIC_KEY' in process.env &&
        'EXPIRES_IN' in process.env && 
        'DB_CONN_STRING' in process.env && 
        'DB_NAME' in process.env
    )
    if (!hasProps) return false
    let expiresIn = 0
    try {
        expiresIn = Number.parseInt(<string>process.env.EXPIRES_IN)
    } catch (err) {
        return false
    }
    let validProps = (
        (<string>process.env.RSA_PRIVATE_KEY).trim().length > 0 &&
        (<string>process.env.RSA_PUBLIC_KEY).trim().length > 0 &&
        expiresIn > 0 &&
        (<string>process.env.DB_CONN_STRING).trim().length > 0 &&
        (<string>process.env.DB_NAME).trim().length > 0
    )
    return validProps
}

const start = async () => {
    checkEnvVars()
    await getCollections(<string>process.env.DB_CONN_STRING, <string>process.env.DB_NAME)
    app.listen(process.env.PORT || PORT, () => {
        console.log(`Express server launched (port ${process.env.PORT || PORT})`)
    })
}

start().catch(err => {
    console.error(err)
})

import express from 'express'
import path from 'path'
import dotenv from 'dotenv'

import { AppError, AppErrorCodes, instanceOfAppError } from 'models'

import { getCollections } from './db'
import { register, login } from './funcs'

import config from '../config'

const app: express.Application = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, '/../../client-dist')))

const checkStringOrNumProps = (object: object, keys: string[]) => {
    let valid = true
    let objKeys = Object.keys(object) as Array<keyof typeof object>
    keys.forEach((key1) => {
        let found = false
        objKeys.forEach((key2: keyof typeof object) => {
            if (key1 == key2) found = true
        })
        if (!found) valid = false
        else if (
            typeof object[<keyof typeof object>key1] != "string" &&
            typeof object[<keyof typeof object>key1] != "number"
        )
            valid = false
    });
    return valid
}

app.post('/register', async (req, res) => {
    try {
        checkStringOrNumProps(req.body, ['email', 'password'])
        res.send(await register(req.body.email, req.body.password))
    } catch (err) {
        if (instanceOfAppError(err)) res.status(400).send(err)
        else {
            console.log(err)
            res.status(500).send(new AppError(AppErrorCodes.SERVER_ERROR))
        }
    }
})

app.post('/login', async (req, res) => {
    try {
        checkStringOrNumProps(req.body, ['email', 'password'])
        res.send(await login(req.body.email, req.body.password))
    } catch (err) {
        if (instanceOfAppError(err)) res.status(400).send(err)
        else {
            console.log(err)
            res.status(500).send(new AppError(AppErrorCodes.SERVER_ERROR))
        }
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../../client-dist/index.html'))
})

const checkConfig = () => {
    return (
        config.RSA_PRIVATE_KEY.trim().length > 0 &&
        config.RSA_PUBLIC_KEY.trim().length > 0 &&
        config.EXPIRES_IN > 0 &&
        config.DB_CONN_STRING.trim().length > 0 &&
        config.DB_NAME.trim().length > 0 &&
        config.PORT > 0
    )
}

const start = async () => {
    checkConfig()
    await getCollections()
    app.listen(process.env.PORT || config.PORT, () => {
        console.log(`Express server launched (port ${process.env.PORT || config.PORT})`)
    })
}

start().catch(err => {
    console.error(err)
})

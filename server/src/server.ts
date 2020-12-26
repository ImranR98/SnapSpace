import express from 'express'
import path from 'path'
import fileUpload from 'express-fileupload'

import { AppError, AppErrorCodes, instanceOfAppError } from 'models'

import { getCollections, findItems, stringArrayToMongoIdArray } from './db'
import { register, login, checkAuthentication, upload, myImages, publicImages, sharedImages, deleteFunc, userEmail, updateSharing, images, confirmRegistration } from './funcs'

import config from './config'

const app: express.Application = express()
app.use(express.json({ limit: '5gb' }))
app.use(express.static(path.join(__dirname, '/../../client-dist')))

app.use(fileUpload({
    createParentPath: true
}))

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
    if (!valid) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
}

// Takes the user's email and password and sends them a registration email if the email is not already registered
app.post('/api/register', async (req, res) => {
    try {
        checkStringOrNumProps(req.body, ['email', 'password'])
        res.send(await register(req.body.email, req.body.password, req.headers.host ? req.headers.host : ''))
    } catch (err) {
        if (instanceOfAppError(err)) res.status(400).send(err)
        else {
            console.log(err)
            res.status(500).send(new AppError(AppErrorCodes.SERVER_ERROR))
        }
    }
})

// Switches the user's email from unregistered to registered if it exists in the DB in the unregistered state
app.post('/api/confirmRegistration', async (req, res) => {
    try {
        checkStringOrNumProps(req.body, ['registrationKey'])
        res.send(await confirmRegistration(req.body.registrationKey))
    } catch (err) {
        if (instanceOfAppError(err)) res.status(400).send(err)
        else {
            console.log(err)
            res.status(500).send(new AppError(AppErrorCodes.SERVER_ERROR))
        }
    }
})

// Takes the user's email and password and returns a JWT if the credentials were valid
app.post('/api/login', async (req, res) => {
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

// Takes multiple image files from the user and saves them to the DB
// Also takes an optional 'others' variable that is either:
// - A boolean to decide if the images should be public (private by default), or
// - A string of user IDs for users who should have access to the images
app.post('/api/upload', checkAuthentication, async (req, res) => {
    try {
        if (!req.files) throw new AppError(AppErrorCodes.NO_FILES_UPLOADED)
        if (req.body.others == undefined) req.body.others = false
        if (req.body.others == 'true' || req.body.others == 'false') req.body.others = JSON.parse(req.body.others)
        if (!(typeof req.body.others == 'boolean' || Array.isArray(req.body.others))) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
        res.send(await upload(<any>req.files, (<any>req).jwt.sub, req.body.others, 256, 256))
    } catch (err) {
        if (instanceOfAppError(err)) res.status(400).send(err)
        else {
            console.log(err)
            res.status(500).send(new AppError(AppErrorCodes.SERVER_ERROR))
        }
    }
})

// Returns all images the user has access to, or a specified subset of them (the limited option omits full hi-res image data)
app.get('/api/images', checkAuthentication, async (req, res) => {
    try {
        res.send(await images((<any>req).jwt.sub, req.query.images ? (<string>req.query.images).split(',') : null, !!req.query.limited))
    } catch (err) {
        if (instanceOfAppError(err)) res.status(400).send(err)
        else {
            console.log(err)
            res.status(500).send(new AppError(AppErrorCodes.SERVER_ERROR))
        }
    }
})

// Returns all the user's images, or a specified subset of them (the limited option omits full hi-res image data)
app.get('/api/images/mine', checkAuthentication, async (req, res) => {
    try {
        res.send(await myImages((<any>req).jwt.sub, req.query.images ? (<string>req.query.images).split(',') : null, !!req.query.limited))
    } catch (err) {
        if (instanceOfAppError(err)) res.status(400).send(err)
        else {
            console.log(err)
            res.status(500).send(new AppError(AppErrorCodes.SERVER_ERROR))
        }
    }
})

// Returns all public images, or a specified subset of them (the limited option omits full hi-res image data)
app.get('/api/images/public', checkAuthentication, async (req, res) => {
    try {
        res.send(await publicImages(req.query.images ? (<string>req.query.images).split(',') : null, !!req.query.limited))
    } catch (err) {
        if (instanceOfAppError(err)) res.status(400).send(err)
        else {
            console.log(err)
            res.status(500).send(new AppError(AppErrorCodes.SERVER_ERROR))
        }
    }
})

// Returns all images shared with the user by others, or a specified subset of them (the limited option omits full hi-res image data)
app.get('/api/images/sharedWithMe', checkAuthentication, async (req, res) => {
    try {
        res.send(await sharedImages((<any>req).jwt.sub, req.query.images ? (<string>req.query.images).split(',') : null, !!req.query.limited))
    } catch (err) {
        if (instanceOfAppError(err)) res.status(400).send(err)
        else {
            console.log(err)
            res.status(500).send(new AppError(AppErrorCodes.SERVER_ERROR))
        }
    }
})

// Deletes all images specified in the request body that the user owns
app.post('/api/delete', checkAuthentication, async (req, res) => {
    try {
        if (!req.body.images) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
        if (!Array.isArray(req.body.images)) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
        if (req.body.images.length == 0) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
        if (typeof req.body.images[0] != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
        res.send(await deleteFunc((<any>req).jwt.sub, req.body.images))
    } catch (err) {
        if (instanceOfAppError(err)) res.status(400).send(err)
        else {
            console.log(err)
            res.status(500).send(new AppError(AppErrorCodes.SERVER_ERROR))
        }
    }
})

// Gives the email for a specified user ID
app.get('/api/email', async (req, res) => {
    try {
        checkStringOrNumProps(req.query, ['user'])
        res.send(await userEmail(<string>req.query.user))
    } catch (err) {
        if (instanceOfAppError(err)) res.status(400).send(err)
        else {
            console.log(err)
            res.status(500).send(new AppError(AppErrorCodes.SERVER_ERROR))
        }
    }
})

// Updates sharing options for all images specified in the request body that the user owns
app.post('/api/updateSharing', checkAuthentication, async (req, res) => {
    try {
        if (!req.body.images) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
        if (!Array.isArray(req.body.images)) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
        if (req.body.images.length == 0) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
        if (typeof req.body.images[0] != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
        if (req.body.others == 'true' || req.body.others == 'false') req.body.others = JSON.parse(req.body.others)
        if (!(typeof req.body.others == 'boolean' || Array.isArray(req.body.others))) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
        res.send(await updateSharing((<any>req).jwt.sub, req.body.images, req.body.others))
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
        config.PORT > 0 &&
        config.EMAILER_NAME.trim().length > 0
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
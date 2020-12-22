import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import expressJwt from 'express-jwt'
import fileUpload, { UploadedFile } from 'express-fileupload'

import { getItemsByAttribute, insertItems } from './db'
import config from '../config'

import { AppError, AppErrorCodes, Image, instanceOfImages, instanceOfUser, User } from 'models'

const checkAuthentication = expressJwt({
    secret: config.RSA_PUBLIC_KEY,
    requestProperty: 'jwt',
    algorithms: ['RS256']
})
export { checkAuthentication }

export async function register(email: string, password: string) {
    let existingUsers = (await getItemsByAttribute('users', 'email', email))
    if (existingUsers.length > 0) throw new AppError(AppErrorCodes.EMAIL_IN_USE)
    let hashedPassword = bcrypt.hashSync(password, 10)
    let user = new User(email, hashedPassword)
    await insertItems('users', [user])
}

export async function login(email: string, password: string) {
    let user = (await getItemsByAttribute('users', 'email', email))[0]
    if (typeof user?._id == 'object') user._id.toString()
    if (!instanceOfUser(user)) throw new AppError(AppErrorCodes.INVALID_USER)
    if (bcrypt.compareSync(password, user.hashedPassword)) {
        return {
            jwtToken: jsonwebtoken.sign({}, config.RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: config.EXPIRES_IN,
                subject: user._id?.toString()
            })
        }
    }
}

export async function upload(files: fileUpload.FileArray, owner: string, others: boolean | string[]) {
    let images: Image[] = []
    for (const key in files) {
        let currentFile = <UploadedFile>files[key]
        images.push({
            _id: null,
            data: currentFile.data,
            encoding: currentFile.encoding,
            md5: currentFile.md5,
            mimetype: currentFile.mimetype,
            name: currentFile.name,
            size: currentFile.size,
            owner: owner,
            others: others
        })
    }
    if (!instanceOfImages(images)) throw new AppError(AppErrorCodes.INVALID_IMAGE)
    await insertItems('images', images)
}

export async function images(userId: string, imageIds: string[] | null = null) {
    let images: Image[] = []
    if (imageIds == null) {
        images = await getItemsByAttribute('images', 'owner', userId)
        if (!instanceOfImages(images)) throw new AppError(AppErrorCodes.INVALID_IMAGE)
    } else {
        images = await getItemsByAttribute('images', '_id', { $in: imageIds })
        if (!instanceOfImages(images)) throw new AppError(AppErrorCodes.INVALID_IMAGE)
        images = images.filter(image => {
            let allowed = image.owner == userId
            if (allowed) return allowed
            if (Array.isArray(image.others))
                allowed = image.others.findIndex(other => other == userId) >= 0
            else
                return image.others
        })
    }
    return images
}
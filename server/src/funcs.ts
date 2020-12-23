import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import expressJwt from 'express-jwt'
import fileUpload, { UploadedFile } from 'express-fileupload'

import { getDataFromMongo, insertItems } from './db'
import config from '../config'

import { AppError, AppErrorCodes, Image, instanceOfImages, instanceOfUser, User } from 'models'
import { getBase64Thumbnail } from './image'

const checkAuthentication = expressJwt({
    secret: config.RSA_PUBLIC_KEY,
    requestProperty: 'jwt',
    algorithms: ['RS256']
})
export { checkAuthentication }

export async function register(email: string, password: string) {
    let existingUsers = (await getDataFromMongo('users', { email }))
    if (existingUsers.length > 0) throw new AppError(AppErrorCodes.EMAIL_IN_USE)
    let hashedPassword = bcrypt.hashSync(password, 10)
    let user = new User(email, hashedPassword)
    await insertItems('users', [user])
}

export async function login(email: string, password: string) {
    let user = (await getDataFromMongo('users', { email }))[0]
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

export async function upload(files: fileUpload.FileArray, owner: string, others: boolean | string[], thumbnailWidth: number, thumbnailHeight: number) {
    let images: Image[] = []
    for (const key in files) {
        let currentFile = <UploadedFile>files[key]
        images.push({
            _id: null,
            data: currentFile.data.toString('base64'),
            thumbnail: await getBase64Thumbnail(currentFile, thumbnailWidth, thumbnailHeight),
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

export async function images(userId: string, imageIds: string[] | null = null, limited: boolean = false) {
    let images: Image[] = []
    let limitedAttributes = ['_id', 'thumbnail', 'encoding', 'md5', 'mimetype', 'name', 'size', 'owner', 'others']
    if (imageIds == null) {
        images = await getDataFromMongo('images', { owner: userId }, limited ? limitedAttributes : null)
        if (!instanceOfImages(images)) throw new AppError(AppErrorCodes.INVALID_IMAGE)
    } else {
        images = await getDataFromMongo('images', { _id: { $in: imageIds } }, limited ? limitedAttributes : null)
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
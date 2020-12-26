import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import expressJwt from 'express-jwt'
import fileUpload from 'express-fileupload'

import { deleteItems, findItems, insertItems, stringArrayToMongoIdArray, updateItems } from './db'
import config from './config'
import { sendEmail } from './email'

import { AppError, AppErrorCodes, Image, instanceOfImages, instanceOfUser, User } from 'models'
import { getBase64Thumbnail } from './image'

const checkAuthentication = expressJwt({
    secret: config.RSA_PUBLIC_KEY,
    requestProperty: 'jwt',
    algorithms: ['RS256']
})
export { checkAuthentication }

export function getRandomString(length: number) {
    var result = ""
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

async function sendRegistrationEmail(email: string, registrationKey: string, hostUrl: string) {
    await sendEmail([email], 'SnapSpace Registration', `<h1>Welcome!</h1><p>Click the link to complete registration: <a href="http://${hostUrl}/confirmRegistration?registrationKey=${registrationKey}">http://${hostUrl}/confirmRegistration?registrationKey=${registrationKey}</a></p>`)
}

export async function register(email: string, password: string, hostUrl: string) {
    let existingUser: User = (await findItems('users', { email }))[0]
    if (!existingUser) {
        let hashedPassword = bcrypt.hashSync(password, 10)
        let registrationKey = getRandomString(50)
        let user = new User(email, hashedPassword, registrationKey, false)
        await insertItems('users', [user])
        await sendRegistrationEmail(email, registrationKey, hostUrl)
    } else if (!existingUser.registered) await sendRegistrationEmail(existingUser.email, existingUser.registrationKey, hostUrl)
    else throw new AppError(AppErrorCodes.EMAIL_IN_USE)
}

export async function confirmRegistration(registrationKey: string) {
    let existingUser: User = (await findItems('users', { registrationKey }))[0]
    if (!existingUser) throw new AppError(AppErrorCodes.USER_NOT_FOUND)
    if (existingUser.registrationKey != registrationKey) throw new AppError(AppErrorCodes.INVALID_REGISTRATION_KEY)
    if (existingUser.registered) throw new AppError(AppErrorCodes.ALREADY_REGISTERED)
    else await updateItems('users', { _id: stringArrayToMongoIdArray([<string>existingUser._id])[0] }, { $set: { registered: true } })
}

export async function login(email: string, password: string) {
    let user = (await findItems('users', { email }))[0]
    if (!instanceOfUser(user)) throw new AppError(AppErrorCodes.INVALID_USER)
    if (!user.registered) throw new AppError(AppErrorCodes.EMAIL_UNVERIFIED)
    if (bcrypt.compareSync(password, user.hashedPassword)) {
        return {
            jwtToken: jsonwebtoken.sign({}, config.RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: config.EXPIRES_IN,
                subject: user._id?.toString()
            })
        }
    } else throw new AppError(AppErrorCodes.WRONG_PASSWORD)
}

export async function upload(files: fileUpload.FileArray, owner: string, others: boolean | string[], thumbnailWidth: number, thumbnailHeight: number) {
    let images: Image[] = []
    if (Array.isArray(files.files)) {
        for (let i = 0; i < files.files.length; i++) {
            let currentFile = files.files[i]
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
    } else {
        let currentFile = files.files
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

// Returns all images the user has access to, or a specified subset of them (the limited option omits full hi-res image data)
export async function images(userId: string, imageIds: string[] | null = null, limited: boolean = false) {
    let images: Image[] = []
    let email: string = (await userEmail(userId)).email
    let limitedAttributes = ['_id', 'thumbnail', 'encoding', 'md5', 'mimetype', 'name', 'size', 'owner', 'others']
    if (imageIds == null) {
        images = await findItems('images', {}, limited ? limitedAttributes : null)
        if (!instanceOfImages(images)) throw new AppError(AppErrorCodes.INVALID_IMAGE)
    } else {
        images = await findItems('images', { _id: { $in: stringArrayToMongoIdArray(imageIds) } }, limited ? limitedAttributes : null)
        if (!instanceOfImages(images)) throw new AppError(AppErrorCodes.INVALID_IMAGE)
    }
    images = images.filter(image => {
        let isOwner = image.owner == userId
        if (isOwner) return isOwner
        if (Array.isArray(image.others))
            return image.others.findIndex(other => other == email) >= 0
        else
            return image.others
    })
    return images
}

// Returns all the user's images, or a specified subset of them (the limited option omits full hi-res image data)
export async function myImages(userId: string, imageIds: string[] | null = null, limited: boolean = false) {
    let images: Image[] = []
    let limitedAttributes = ['_id', 'thumbnail', 'encoding', 'md5', 'mimetype', 'name', 'size', 'owner', 'others']
    if (imageIds == null) {
        images = await findItems('images', { owner: userId }, limited ? limitedAttributes : null)
        if (!instanceOfImages(images)) throw new AppError(AppErrorCodes.INVALID_IMAGE)
    } else {
        images = await findItems('images', { _id: { $in: stringArrayToMongoIdArray(imageIds) }, owner: userId }, limited ? limitedAttributes : null)
        if (!instanceOfImages(images)) throw new AppError(AppErrorCodes.INVALID_IMAGE)
    }
    return images
}

// Returns all public images, or a specified subset of them (the limited option omits full hi-res image data)
export async function publicImages(imageIds: string[] | null = null, limited: boolean = false) {
    let images: Image[] = []
    let limitedAttributes = ['_id', 'thumbnail', 'encoding', 'md5', 'mimetype', 'name', 'size', 'owner', 'others']
    if (imageIds == null) {
        images = await findItems('images', { others: true }, limited ? limitedAttributes : null)
        if (!instanceOfImages(images)) throw new AppError(AppErrorCodes.INVALID_IMAGE)
    } else {
        images = await findItems('images', { _id: { $in: stringArrayToMongoIdArray(imageIds) }, others: true }, limited ? limitedAttributes : null)
        if (!instanceOfImages(images)) throw new AppError(AppErrorCodes.INVALID_IMAGE)
    }
    return images
}

// Returns all images shared with the user by others, or a specified subset of them (the limited option omits full hi-res image data)
export async function sharedImages(userId: string, imageIds: string[] | null = null, limited: boolean = false) {
    let images: Image[] = []
    let limitedAttributes = ['_id', 'thumbnail', 'encoding', 'md5', 'mimetype', 'name', 'size', 'owner', 'others']
    let email: string = (await userEmail(userId)).email
    if (imageIds == null) {
        images = await findItems('images', { others: email }, limited ? limitedAttributes : null)
        if (!instanceOfImages(images)) throw new AppError(AppErrorCodes.INVALID_IMAGE)
    } else {
        images = await findItems('images', { _id: { $in: stringArrayToMongoIdArray(imageIds) }, others: email }, limited ? limitedAttributes : null)
        if (!instanceOfImages(images)) throw new AppError(AppErrorCodes.INVALID_IMAGE)
    }
    return images
}

export async function deleteFunc(userId: string, imageIds: string[]) {
    let images: Image[] = []
    images = await findItems('images', { _id: { $in: stringArrayToMongoIdArray(imageIds) } }, ['_id', 'owner'])
    images = images.filter(image => image.owner == userId)
    await deleteItems('images', { _id: { $in: stringArrayToMongoIdArray(<string[]>images.map(image => image._id)) } })
}

export async function userEmail(id: string) {
    let user: User = (await findItems('users', { _id: stringArrayToMongoIdArray([id])[0] }))[0]
    if (!user) throw new AppError(AppErrorCodes.INVALID_USER)
    return { email: user.email }
}

export async function updateSharing(userId: string, imageIds: string[], others: boolean | string[]) {
    let images: Image[] = []
    images = await findItems('images', { _id: { $in: stringArrayToMongoIdArray(imageIds) } }, ['_id', 'owner'])
    images = images.filter(image => image.owner == userId)
    await updateItems('images', { _id: { $in: stringArrayToMongoIdArray(<string[]>images.map(image => image._id)) } }, { $set: { others } })
    return images
}
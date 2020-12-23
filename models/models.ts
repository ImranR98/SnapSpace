export class User {
    _id: string | null
    email: string
    hashedPassword: string

    constructor(email: string, hashedPassword: string) {
        this._id = null
        this.email = email.trim()
        this.hashedPassword = hashedPassword.trim()
    }
}

export function instanceOfUser(object: any): object is User {
    if (typeof object != 'object') return false
    let hasProps = (
        '_id' in object &&
        'email' in object &&
        'hashedPassword' in object
    )
    if (typeof object._id == 'object') object._id = object._id.toString()
    if (!hasProps) return false
    let goodPropTypes = (
        (typeof object._id == 'string' || object._id == null) &&
        typeof object.email == 'string' &&
        typeof object.hashedPassword == 'string'
    )
    if (!goodPropTypes) return false
    let validProps = (
        object._id?.trim().length > 0 &&
        object.email.trim().length > 0 &&
        object.hashedPassword.trim().length > 0
    )
    return validProps
}

export function instanceOfUsers(object: any): object is User[] {
    if (!Array.isArray(object)) return false
    for (let i = 0; i < object.length; i++) {
        if (!instanceOfUser(object[i])) return false
    }
    return true
}

export class Image {
    _id: string | null
    data: Buffer
    encoding: string
    md5: string
    mimetype: string
    name: string
    size: number
    owner: string
    others: boolean | string[]

    constructor(data: Buffer, encoding: string, md5: string, mimetype: string, name: string, size: number, owner: string, others: boolean | string[]) {
        this._id = null
        this.data = data
        this.encoding = encoding.trim()
        this.md5 = md5.trim()
        this.mimetype = mimetype.trim()
        this.mimetype = mimetype.trim()
        this.name = name.trim()
        this.size = size
        this.owner = owner.trim()
        this.others = others
    }
}

export function instanceOfImage(object: any): object is Image {
    if (typeof object != 'object') return false
    let hasProps = (
        '_id' in object &&
        'data' in object &&
        'encoding' in object &&
        'md5' in object &&
        'mimetype' in object &&
        'name' in object &&
        'size' in object &&
        'owner' in object &&
        'others' in object
    )
    if (typeof object._id == 'object' && object._id != null) object._id = object._id?.toString()
    if (typeof object.others == 'string' && (object.others == 'true' || object.others == 'false')) object.others = JSON.parse(object.others)
    if (!hasProps) return false
    let goodPropTypes = (
        (typeof object._id == 'string' || object._id == null) &&
        Buffer.isBuffer(object.data) &&
        typeof object.encoding == 'string' &&
        typeof object.md5 == 'string' &&
        typeof object.mimetype == 'string' &&
        typeof object.name == 'string' &&
        typeof object.size == 'number' &&
        typeof object.owner == 'string' &&
        (typeof object.others == 'boolean' || Array.isArray(object.others))
    )
    if (!goodPropTypes) return false
    let validProps = (
        (object._id == null || object._id?.trim().length > 0) &&
        object.data.length > 0 &&
        object.encoding.trim().length > 0 &&
        object.md5.trim().length > 0 &&
        object.mimetype.trim().length > 0 &&
        object.name.trim().length > 0 &&
        object.size > 0 &&
        object.owner.trim().length > 0
    )
    if (!validProps) return false
    if (Array.isArray(object.others)) {
        if (object.others.length == 0) return false
        let isNotString = false
        object.others.forEach((other: any) => {
            if (typeof other != 'string') isNotString = true
        })
        if (isNotString) return false
    }
    if (object.mimetype.indexOf('image/') != 0) return false
    return validProps
}

export function instanceOfImages(object: any): object is Image[] {
    if (!Array.isArray(object)) return false
    for (let i = 0; i < object.length; i++) {
        if (!instanceOfImage(object[i])) return false
    }
    return true
}

export enum AppErrorCodes {
    SERVER_ERROR,
    MISSING_ARGUMENT,
    INVALID_ARGUMENT,
    INVALID_USER,
    EMAIL_IN_USE,
    NO_FILES_UPLOADED,
    INVALID_IMAGE
}

export class AppError {
    code: AppErrorCodes
    data: any

    constructor(code: AppErrorCodes, data: any = null) {
        this.code = code
        this.data = data
    }
}

export function instanceOfAppError(object: any): object is AppError {
    if (typeof object != 'object') return false
    let hasProps = (
        'code' in object &&
        'data' in object
    )
    if (!hasProps) return false
    let goodPropTypes = (
        typeof object.code == 'number' &&
        typeof object.data == 'object'
    )
    if (!goodPropTypes) return false
    let validProps = (
        object.code in AppErrorCodes
    )
    return validProps
}
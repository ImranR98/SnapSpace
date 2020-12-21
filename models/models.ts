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
    if (!hasProps) return false
    let goodPropTypes = (
        (typeof object._id == 'object' || object._id == null) &&
        typeof object.email == 'string' &&
        typeof object.hashedPassword == 'string'
    )
    if (!goodPropTypes) return false
    let validProps = (
        object.email.trim().length > 0 &&
        object.hashedPassword.trim().length > 0
    )
    return validProps
}

export function instanceOfUsers(object: any): object is User[] {
    if (!Array.isArray(object)) return false
    object.forEach(obj => {
        if (!instanceOfUser(obj)) return false
    })
    return true
}

export enum AppErrorCodes {
    SERVER_ERROR,
    MISSING_ARGUMENT,
    INVALID_ARGUMENT,
    INVALID_USER,
    EMAIL_IN_USE
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
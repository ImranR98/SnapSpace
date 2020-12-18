export class User {
    id: string
    email: string
    hashedPassword: string

    constructor(id: string, email: string, hashedPassword: string) {
        this.id = id.trim()
        this.email = email.trim()
        this.hashedPassword = hashedPassword.trim()
    }
}

export function instanceOfUser(object: any): object is User {
    if (typeof object != 'object') return false
    let hasProps = (
        'id' in object &&
        'email' in object &&
        'hashedPassword' in object
    )
    if (!hasProps) return false
    let goodPropTypes = (
        typeof object.id == 'string' &&
        typeof object.email == 'string' &&
        typeof object.hashedPassword == 'string'
    )
    if (!goodPropTypes) return false
    let validProps = (
        object.id.trim().length > 0 &&
        object.email.trim().length > 0 &&
        object.password.trim().length > 0
    )
    return validProps
}
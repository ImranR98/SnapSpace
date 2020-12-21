import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { getItemsByAttribute, insertItems } from './db'
import config from '../config'
import { AppError, AppErrorCodes, instanceOfUser, User } from 'models'

export async function register(email: string, password: string) {
    let existingUsers = (await getItemsByAttribute('users', 'email', email))
    if (existingUsers.length > 0) throw new AppError(AppErrorCodes.EMAIL_IN_USE)
    let hashedPassword = bcrypt.hashSync(password, 10)
    let user = new User(email, hashedPassword)
    await insertItems('users', [user])
}

export async function login(email: string, password: string) {
    let user = (await getItemsByAttribute('users', 'email', email))[0]
    if (!instanceOfUser(user)) throw new AppError(AppErrorCodes.INVALID_USER)
    if (bcrypt.compareSync(password, user.hashedPassword)) {
        return {
            jwtToken: jsonwebtoken.sign({}, config.RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: config.EXPIRES_IN
            })
        }
    }
}


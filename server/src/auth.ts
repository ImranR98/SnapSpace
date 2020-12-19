
const bcrypt = require('bcrypt')

export function authenticate(password: string, storedHashedPassword: string) {
    bcrypt.compareSync(password, storedHashedPassword)
}

export function generateHash(password: string) {
    bcrypt.hashSync(password, 10)
}
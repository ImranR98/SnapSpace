import * as nodemailer from 'nodemailer'
import { get_EMAILER_NAME, get_EMAILER_TRANSPORT_OPTIONS_JSON } from './config'

export function verifyEmail() {
    let transporter = nodemailer.createTransport(get_EMAILER_TRANSPORT_OPTIONS_JSON())
    return transporter.verify()
}

export function sendEmail(receivers: string[], subject: string, contentHTML: string) {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport(get_EMAILER_TRANSPORT_OPTIONS_JSON())
        let mailOptions = {
            from: `${get_EMAILER_NAME()} <${get_EMAILER_TRANSPORT_OPTIONS_JSON().auth?.user}>`,
            to: receivers,
            subject: subject,
            html: contentHTML
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error)
            }
            resolve(info)
        })
    })
}
import * as nodemailer from 'nodemailer'
import config from './config'

export function sendEmail(receivers: string[], subject: string, contentHTML: string) {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport(config.EMAILER_TRANSPORT_OPTIONS)
        let mailOptions = {
            from: `${config.EMAILER_NAME} <${config.EMAILER_TRANSPORT_OPTIONS.auth?.user}>`,
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
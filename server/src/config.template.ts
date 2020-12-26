import SMTPTransport from "nodemailer/lib/smtp-transport"

const config: {
    RSA_PRIVATE_KEY: string,
    RSA_PUBLIC_KEY: string,
    EXPIRES_IN: number,
    DB_CONN_STRING: string,
    DB_NAME: string,
    PORT: number,
    EMAILER_NAME: string,
    EMAILER_TRANSPORT_OPTIONS: SMTPTransport.Options
} = {
    RSA_PRIVATE_KEY: `-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----`,
    RSA_PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----`,
    EXPIRES_IN: 86400,
    DB_CONN_STRING: 'mongodb://localhost:27017',
    DB_NAME: 'snap-space-db',
    PORT: 8080,
    EMAILER_NAME: 'SnapSpace',
    EMAILER_TRANSPORT_OPTIONS: {
        host: "smtp-mail.outlook.com",
        secure: false,
        port: 587,
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: 'mymail@outlook.com',
            pass: 'myPassword'
        }
    }
}

export default config
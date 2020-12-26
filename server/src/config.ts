import SMTPTransport from "nodemailer/lib/smtp-transport"

function ensureEnvVarExists(varName: string) {
    if (!process.env[varName]) throw `The '${varName}' environment variable does not exist!`
}

function ensureEnvVarNotEmpty(varName: string) {
    if (process.env[varName]?.trim().length == 0) throw `The '${varName}' environment variable is empty!`
}

function getEnvVar(varName: string): string {
    ensureEnvVarExists(varName)
    ensureEnvVarNotEmpty(varName)
    return <string>process.env[varName]
}

function getMultilineEnvVar(varName: string) {
    let envVar = getEnvVar(varName)
    return envVar.split('\n').filter(line => line.trim().length != 0).length == 1 ? envVar.replace(/\\n/g, '\n') : envVar
}


export function checkRequiredEnvVars() {
    get_RSA_PRIVATE_KEY()
    get_RSA_PUBLIC_KEY()
    get_EXPIRES_IN()
    get_DB_CONN_STRING()
    get_DB_NAME()
    get_PORT()
    get_EMAILER_NAME()
    get_EMAILER_TRANSPORT_OPTIONS_JSON()
}

export function get_RSA_PRIVATE_KEY(): string {
    return getMultilineEnvVar('RSA_PRIVATE_KEY')
}
export function get_RSA_PUBLIC_KEY(): string {
    return getMultilineEnvVar('RSA_PUBLIC_KEY')
}
export function get_EXPIRES_IN(): number {
    return Number.parseInt(getEnvVar('EXPIRES_IN'))
}
export function get_DB_CONN_STRING(): string {
    return getEnvVar('DB_CONN_STRING')
}
export function get_DB_NAME(): string {
    return getEnvVar('DB_NAME')
}
export function get_PORT(): number {
    return Number.parseInt(getEnvVar('PORT'))
}
export function get_EMAILER_NAME(): string {
    return getEnvVar('EMAILER_NAME')
}
export function get_EMAILER_TRANSPORT_OPTIONS_JSON(): SMTPTransport.Options {
    return JSON.parse(getEnvVar('EMAILER_TRANSPORT_OPTIONS_JSON'))
}
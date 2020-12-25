const config = {
    RSA_PRIVATE_KEY: `----- BEGIN RSA PRIVATE KEY-----
...
----- END RSA PRIVATE KEY-----`,
    RSA_PUBLIC_KEY: `----- BEGIN PUBLIC KEY-----
...
----- END PUBLIC KEY-----`,
    EXPIRES_IN: 86400,
    DB_CONN_STRING: 'mongodb://localhost:27017',
    DB_NAME: 'snap-space-db',
    PORT: 8080
}

export default config
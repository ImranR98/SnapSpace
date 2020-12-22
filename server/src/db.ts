import mongodb from 'mongodb'
import config from '../config'

export async function getCollections() {
    let conn = await new mongodb.MongoClient(config.DB_CONN_STRING, { useUnifiedTopology: true }).connect()
    let result = await (await conn.db(config.DB_NAME).listCollections()).toArray()
    await conn.close()
    return result
}

export async function insertItems(collection: string, items: object[]) {
    let conn = await new mongodb.MongoClient(config.DB_CONN_STRING, { useUnifiedTopology: true }).connect()
    let result = await conn.db(config.DB_NAME).collection(collection).insertMany(items)
    await conn.close()
    return result
}

export async function getItemsByAttribute(collection: string, attribute: string, query: any) {
    let conn = await new mongodb.MongoClient(config.DB_CONN_STRING, { useUnifiedTopology: true }).connect()
    let opt: mongodb.FilterQuery<any> = {}
    opt[attribute] = query
    let result = await (await conn.db(config.DB_NAME).collection(collection).find(opt)).toArray()
    await conn.close()
    return result
}
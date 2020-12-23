import mongodb, { FilterQuery, FindOneOptions } from 'mongodb'
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

// Get an array of all objects in a MongoDB database collection, returning only specified attributes (if specified, else all attributes returned)
export async function getDataFromMongo(collection: string, query: FilterQuery<any> = {}, attributes: string[] | null = null) {
    let options: FindOneOptions<any> = {}
    let projection: any = {}
    if (attributes) attributes.forEach(attribute => projection[attribute] = 1)
    let conn = await new mongodb.MongoClient(config.DB_CONN_STRING, { useUnifiedTopology: true }).connect()
    let result = null
    result = (await conn.db(config.DB_NAME).collection(collection).find(query, options).toArray())
    await conn.close()
    return result
}
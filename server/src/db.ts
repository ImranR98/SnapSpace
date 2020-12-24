import mongodb, { DeleteWriteOpResultObject, FilterQuery, FindOneOptions, ObjectId, SchemaMember } from 'mongodb'
import config from '../config'

export function stringArrayToMongoIdArray(ids: string[]) {
    return ids.map(id => new ObjectId(id))
}

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
    let projection: SchemaMember<any, any> = {}
    if (attributes) attributes.forEach(attribute => projection[attribute] = 1)
    let conn = await new mongodb.MongoClient(config.DB_CONN_STRING, { useUnifiedTopology: true }).connect()
    let result: any[] = (await conn.db(config.DB_NAME).collection(collection).find(query, options).toArray())
    await conn.close()
    return result
}

export async function deleteFromMongo(collection: string, query: FilterQuery<any> = {}) {
    let conn = await new mongodb.MongoClient(config.DB_CONN_STRING, { useUnifiedTopology: true }).connect()
    let result: DeleteWriteOpResultObject = await conn.db(config.DB_NAME).collection(collection).deleteMany(query)
    await conn.close()
    return result
}
import mongodb, { DeleteWriteOpResultObject, FilterQuery, FindOneOptions, ObjectId, SchemaMember, UpdateQuery, UpdateWriteOpResult } from 'mongodb'
import { get_DB_CONN_STRING, get_DB_NAME } from './config'

export function stringArrayToMongoIdArray(ids: string[]) {
    return ids.map(id => new ObjectId(id))
}

export async function getCollections() {
    let conn = await new mongodb.MongoClient(get_DB_CONN_STRING(), { useUnifiedTopology: true, useNewUrlParser: true }).connect()
    let result = await (await conn.db(get_DB_NAME()).listCollections()).toArray()
    await conn.close()
    return result
}

export async function insertItems(collection: string, items: object[]) {
    let conn = await new mongodb.MongoClient(get_DB_CONN_STRING(), { useUnifiedTopology: true, useNewUrlParser: true }).connect()
    let result = await conn.db(get_DB_NAME()).collection(collection).insertMany(items)
    await conn.close()
    return result
}

// Get an array of all objects in a MongoDB database collection, returning only specified attributes (if specified, else all attributes returned)
export async function findItems(collection: string, query: FilterQuery<any> = {}, attributes: string[] | null = null, pages: { pageSize: number, pageIndex: number } | null = null) {
    let options: FindOneOptions<any> = {}
    if (pages != null) {
        options.skip = pages.pageIndex * pages.pageSize
        options.limit = pages.pageSize
    }
    let projection: SchemaMember<any, any> = {}
    if (attributes) attributes.forEach(attribute => projection[attribute] = 1)
    let conn = await new mongodb.MongoClient(get_DB_CONN_STRING(), { useUnifiedTopology: true, useNewUrlParser: true }).connect()
    let result: any[] = (await conn.db(get_DB_NAME()).collection(collection).find(query, options).toArray())
    await conn.close()
    return result
}

export async function deleteItems(collection: string, query: FilterQuery<any> = {}) {
    let conn = await new mongodb.MongoClient(get_DB_CONN_STRING(), { useUnifiedTopology: true, useNewUrlParser: true }).connect()
    let result: DeleteWriteOpResultObject = await conn.db(get_DB_NAME()).collection(collection).deleteMany(query)
    await conn.close()
    return result
}

export async function updateItems(collection: string, query: FilterQuery<any> = {}, update: UpdateQuery<any>) {
    let conn = await new mongodb.MongoClient(get_DB_CONN_STRING(), { useUnifiedTopology: true, useNewUrlParser: true }).connect()
    let result: UpdateWriteOpResult = await conn.db(get_DB_NAME()).collection(collection).updateMany(query, update)
    await conn.close()
    return result
}
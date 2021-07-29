import { MongoClient, DeleteResult, Document, Filter, FindOptions, ObjectId, SchemaMember, UpdateFilter, UpdateResult } from 'mongodb'
import { get_DB_CONN_STRING, get_DB_NAME } from './config'

export function stringArrayToMongoIdArray(ids: string[]) {
    return ids.map(id => new ObjectId(id))
}

export async function getCollections() {
    let conn = await new MongoClient(get_DB_CONN_STRING()).connect()
    let result = await (await conn.db(get_DB_NAME()).listCollections()).toArray()
    await conn.close()
    return result
}

export async function insertItems(collection: string, items: object[]) {
    let conn = await new MongoClient(get_DB_CONN_STRING()).connect()
    let result = await conn.db(get_DB_NAME()).collection(collection).insertMany(items)
    await conn.close()
    return result
}

// Get an array of all objects in a MongoDB database collection, returning only specified attributes (if specified, else all attributes returned)
export async function findItems(collection: string, query: Filter<any> = {}, attributes: string[] | null = null, pages: { pageSize: number, pageIndex: number } | null = null) {
    let options: FindOptions<any> = {}
    if (pages != null) {
        options.skip = pages.pageIndex * pages.pageSize
        options.limit = pages.pageSize
    }
    let projection: SchemaMember<any, any> = {}
    if (attributes) attributes.forEach(attribute => projection[attribute] = 1)
    let conn = await new MongoClient(get_DB_CONN_STRING()).connect()
    let result: any[] = (await conn.db(get_DB_NAME()).collection(collection).find(query, options).toArray())
    await conn.close()
    return result
}

export async function deleteItems(collection: string, query: Filter<any> = {}) {
    let conn = await new MongoClient(get_DB_CONN_STRING()).connect()
    let result: DeleteResult = await conn.db(get_DB_NAME()).collection(collection).deleteMany(query)
    await conn.close()
    return result
}

export async function updateItems(collection: string, query: Filter<any> = {}, update: UpdateFilter<any>) {
    let conn = await new MongoClient(get_DB_CONN_STRING()).connect()
    let result: Document | UpdateResult = await conn.db(get_DB_NAME()).collection(collection).updateMany(query, update)
    await conn.close()
    return result
}
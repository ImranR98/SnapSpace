import mongodb from 'mongodb'

// TODO: Clean up, optimize these functions and remove any unused ones

// Insert an array of objects into a MongoDB database collection
export async function insertArrayIntoMongo(url: string, db: string, collection: string, array: any[]) {
    let conn = await new mongodb.MongoClient(url, { useUnifiedTopology: true }).connect()
    let result = await conn.db(db).collection(collection).insertMany(array)
    await conn.close()
    return result
}

// Insert an array of objects into a MongoDB database collection
export async function updateItemAttributeById(url: string, db: string, collection: string, id: number, attribute: string, value: any) {
    let conn = await new mongodb.MongoClient(url, { useUnifiedTopology: true }).connect()
    let setObj: any = {}
    setObj[attribute] = value
    let result = await conn.db(db).collection(collection).updateOne({ _id: id }, { $set: setObj })
    await conn.close()
    return result
}

// Get an array of ids for all objects in a MongoDB database collection
export async function getIdsFromMongo(url: string, db: string, collection: string) {
    let conn = await new mongodb.MongoClient(url, { useUnifiedTopology: true }).connect()
    let result = (await conn.db(db).collection(collection).find({}, { projection: { _id: 1 } }).toArray()).map(el => el._id)
    await conn.close()
    return result
}

// Get an array of items by their ids in a MongoDB database collection
export async function getItemsByIdFromMongo(url: string, db: string, collection: string, ids: number[]) {
    let conn = await new mongodb.MongoClient(url, { useUnifiedTopology: true }).connect()
    let result = (await conn.db(db).collection(collection).find({ _id: { $in: ids } }).toArray())
    await conn.close()
    return result
}

// Get an array of all objects in a MongoDB database collection, returning only specified tags (if specified, else all tags returned)
export async function getDataFromMongo(url: string, db: string, collection: string, tags: string[] | null = null, findOptions: mongodb.FilterQuery<any> | null = null) {
    let projection: any = {}
    if (tags) tags.forEach(tag => projection[tag] = 1)
    let conn = await new mongodb.MongoClient(url, { useUnifiedTopology: true }).connect()
    let result = null
    let options : mongodb.FilterQuery<any> = findOptions ? findOptions : {}
    if (projection != {}) result = (await conn.db(db).collection(collection).find(options, { projection: projection }).toArray())
    else result = (await conn.db(db).collection(collection).find({}).toArray())
    await conn.close()
    return result
}

// Get an item with a specific id in a MongoDB database collection
export async function getSingleItemByIdFromMongo(url: string, db: string, collection: string, id: number) {
    let conn = await new mongodb.MongoClient(url, { useUnifiedTopology: true }).connect()
    let result = null
    result = (await conn.db(db).collection(collection).find({ _id: id }).toArray())
    await conn.close()
    return result.length > 0 ? result[0] : null
}

// Remove objects using an array of their specific tags from a MongoDB database collection
export async function removeByTagArrayFromMongo(url: string, db: string, collection: string, tag: string, tagArray: string[]) {
    let conn = await new mongodb.MongoClient(url, { useUnifiedTopology: true }).connect()
    let opts: mongodb.FilterQuery<any> = {}
    opts[tag] = {
        $in: tagArray
    }
    let result = (await conn.db(db).collection(collection).deleteMany(opts)).result
    await conn.close()
    return result
}

// Remove a collection from a MongoDB database
export async function removeCollectionFromMongo(url: string, db: string, collection: string) {
    let conn = await new mongodb.MongoClient(url, { useUnifiedTopology: true }).connect()
    let result = null
    result = await conn.db(db).dropCollection(collection)
    await conn.close()
    return result
}

// Delete a MongoDB database and everything in it
export async function dropDB(url: string, db: string) {
    let conn = await new mongodb.MongoClient(url, { useUnifiedTopology: true }).connect()
    let result = null
    result = await conn.db(db).dropDatabase()
    await conn.close()
    return result
}

// Check if a MongoDB database collection exists
export async function ifCollectionExists(url: string, db: string, collection: string) {
    let conn = await new mongodb.MongoClient(url, { useUnifiedTopology: true }).connect()
    let result = !!((await (await conn.db(db).listCollections()).toArray()).find(coll => coll.name == collection))
    await conn.close()
    return result
}

// Get all collections in a MongoDB database
export async function getCollections(url: string, db: string) {
    let conn = await new mongodb.MongoClient(url, { useUnifiedTopology: true }).connect()
    let result = await (await conn.db(db).listCollections()).toArray()
    await conn.close()
    return result
}
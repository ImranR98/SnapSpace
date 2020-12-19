import sharp from 'sharp'
import { exiftool } from 'exiftool-vendored'
import fs from 'fs'
import tmp from 'tmp'
import path from 'path'

function getFileName(filePath: string) {
    const parsedPath = path.parse(filePath)
    return `${parsedPath.name}.${parsedPath.ext}`
}

export async function resizeImage(existingImagePath: string, destDir: string, width: number, height: number) {
    return await sharp(existingImagePath).resize(width, height).toFile(`${destDir}/${getFileName(existingImagePath)}`)
}

export async function getBase64Thumbnail(imagePath: string, width: number, height: number) {
    let result: string | null = null
    let tempDir = tmp.dirSync().name
    let fileName = getFileName(imagePath)
    await resizeImage(imagePath, tempDir, width, height)
    result = Buffer.from(fs.readFileSync(`${tempDir}/${fileName}`)).toString('base64')
    fs.unlinkSync(`${tempDir}/${fileName}`)
    return result
}

export async function exiftoolRead(dirPath: string, fileNames: string[]) {
    let promises: Promise<any>[] = []
    fileNames.forEach(fileName => {
        promises.push(exiftool.read(`${dirPath}/${fileName}`))
    })
    let results = await Promise.all(promises)
    return results
}
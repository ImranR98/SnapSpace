import sharp from 'sharp'
import fs from 'fs'
import tmp from 'tmp'
import fileUpload from 'express-fileupload'

export async function resizeImageToBuffer(dir: string, fileName: string, width: number, height: number): Promise<Buffer> {
    return await sharp(`${dir}/${fileName}`).resize(width, height).toBuffer()
}

export async function getBase64Thumbnail(image: fileUpload.UploadedFile, width: number, height: number) {
    let tempDir = tmp.dirSync().name
    await image.mv(`${tempDir}/${image.name}`)
    let result = (await resizeImageToBuffer(tempDir, image.name, width, height)).toString('base64')
    fs.unlinkSync(`${tempDir}/${image.name}`)
    return result
}
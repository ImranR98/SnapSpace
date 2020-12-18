import express from 'express'
import path from 'path'

const app: express.Application = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, '/../../client-dist')))
const PORT = 8080

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../../client-dist/index.html'))
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Express server launched (port ${process.env.PORT || PORT})`)
})
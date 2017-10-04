import express from 'express'
import searchRouter from "./search/route"

let app = express()


app.get('/', searchRouter)
app.use('/public', express.static('dist'))

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
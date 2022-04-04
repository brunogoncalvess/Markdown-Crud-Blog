require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const Post = require('./models/post')
const path = require('path')

mongoose.connect(process.env.CONNECTION, {
    useNewUrlParser: true
})

const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('open', () => console.log(`Connected to MongoDB!`))

app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: false }))
app.use(expressLayouts) 
app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
    const posts = await Post.find({})
    posts.reverse()

    res.render('index', { posts: posts })
})

const postsRoute = require('./routes/posts')
const post = require('./models/post')
app.use('/posts', postsRoute)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening to port 3000`)
})
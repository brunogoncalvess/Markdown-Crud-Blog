const express = require('express')
const route = express.Router()
const Post = require('../models/post')

const marked = require('marked')
const sanitizeHtml = require('sanitize-html')

route.get('/new', (req, res) => {
    res.render('new', { post: new Post() })
})

route.post('/', async (req, res) => {    
    const post = new Post({
        title: req.body.title,
        desc: req.body.desc,
        content: req.body.content
    })

    try {
        if (!post.title || !post.content) {
            res.render('new', { post: post, message: 'This field is required!' })
            return
        }

        const savedPost = await post.save()        
        res.redirect(`/posts/${savedPost.id}`)

    } catch (error) {
        console.log(error)
    }
})

route.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.render('show', { post: post })

    } catch (e) {
        res.redirect('/')
    }
})

route.delete('/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

route.get('/edit/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
    
        res.render('edit', { post: post })
        
    } catch (error) {
        res.redirect('/')
    }
})

route.put('/:id', async (req, res) => {
    try {        
        const post = await Post.findByIdAndUpdate(req.params.id, { 
            title: req.body.title,
            desc: req.body.desc,
            content: req.body.content,
            marked: sanitizeHtml(marked.parse(req.body.content))
         })
         res.redirect(`/posts/${req.params.id}`)
        //  console.log(this.content)

    } catch (error) {
        res.render('index')
        console.log(error)
    }
})



module.exports = route
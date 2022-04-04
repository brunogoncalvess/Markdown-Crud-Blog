const mongoose = require('mongoose')
const marked = require('marked')
const sanitizeHtml = require('sanitize-html')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String        
    },
    content: {
        type: String,
        required: true
    },
    marked: {
        type: String
    },

    createdAt: {
        type: Date,
        default: new Date()
    }
});

postSchema.pre('save', function(next) {    
    this.marked = sanitizeHtml(marked.parse(this.content))
    next() 
})


module.exports = mongoose.model('Post', postSchema)

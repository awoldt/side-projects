const mongoose = require('mongoose');
const schema = mongoose.Schema;

const acctSchema = new schema({ 
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }, 
    username: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    postedBlogs: [String]
})

const acctModel = mongoose.model('acctModel', acctSchema);
module.exports = acctModel;
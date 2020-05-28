const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const OrganizationSchema = new Schema({
    username:{
        type: String,
        required:true,
    },
    designation:{
        type: String,
        required:true,
    },
    organizationname: {
        type: String,
    },
    address: {
        type: String,
    },
    contact: {
        type: String,
        require:true
    },
    faxnumber: {
        type: Number
    },
    website:{
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {  //it allows to attach profile image 
        type: String,
    },
    year: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('organizations', OrganizationSchema)
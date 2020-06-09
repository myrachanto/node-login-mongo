const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')


const app = express()
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({extended: true}));
// db connectionmongoose.connect(config.mongo.mongodb_url, {useNewUrlParser: true})
mongoose.connect('mongodb://localhost:27017/nodeloginp', {useNewUrlParser: true})
const Schema = mongoose.Schema
const UserDetail = new Schema({
    username: String,
    password: String
})
const UserDetails = mongoose.model('users', UserDetail, 'users')
app.get('/success', (req, res) => {
    res.send(`welcome ${req.query.username}`)
})
app.get('/error', (req, res) => {
    res.send(`error encountered`)
})
passport.serializeUser( (user, cg) => {
    cg(null, user.id)
})
passport.deserializeUser((id, cg) => {
    User.findById(id, (err, user) => {
        cg(err, user)
    })
})
app.get('/', (req, res) => res.sendFile('views/index.html', { root : __dirname}));
   
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
    (username, password, done) => {
        UserDetails.findOne({
            username: username
        }, (err, user) => {
            if(err) {
                return done(err)
            }
            if(!user){
                return done(null, false)
            }
            return done(null, user)
        })
    }
))
app.post('/', passport.authenticate('local', {failureRedirect: '/error'}),
(req, res) => {
    res.redirect(`/success?username=${req.user.username}`)
})
const port = process.env.PORT || 3000
app.listen(port, () => console.log( `app listenning to port ${port}`))
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
                return done(nulkl, false)
            }
            return done(null, user)
        })
    }
))
applicationCache.post('/', passport.authenticate('local', {failureRedirect: '/error'}),
(req, res) => {
    res.redirect(`/success?username=${req.user.username}`)
})
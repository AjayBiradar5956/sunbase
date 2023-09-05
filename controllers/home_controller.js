module.exports.welcome = function (req, res) {
    return res.render('login', {
        title: "Login Page",
    })
}   
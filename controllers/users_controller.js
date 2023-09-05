module.exports.createSession = function (req, res) {
    console.log("controller reached");
    return res.render('profile', {
        title: "Profile Page",
    })
}   
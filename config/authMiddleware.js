const axios = require('axios');

const authenticateUser = async (req, res, next) => {
    try {
        const authUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp';
        const authPayload = {
            login_id: req.body.email,
            password: req.body.password,
        }
        const response = await axios.post(authUrl, authPayload);
        if (response.status == 200) {
            req.bearerToken = response.data.access_token;
            next();
        }
        else {
            res.status(401).json({ message: "Authentication Failed" });
        }

    } catch (err) {
        console.error('Error while authenticating: ', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/');
}

module.exports = { authenticateUser, checkAuthentication };
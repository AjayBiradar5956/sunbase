const axios = require('axios');
const cookie = require('cookie');

const authenticateUser = async (req, res, next) => {
    // Check if there's a token in the cookie
    const token = req.cookies.access_token;

    if (token) {
        // Token exists; use it for authentication
        next();
    } else {
        // Token doesn't exist
        try {
            const authUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp';
            const authPayload = {
                login_id: req.body.email,
                password: req.body.password,
            };

            const response = await axios.post(authUrl, authPayload);

            if (response.status === 200) {
                const token = response.data.access_token;
                const tokenCookie = cookie.serialize('access_token', token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 3600,
                    sameSite: 'strict',
                    path: '/',
                });
                res.setHeader('Set-Cookie', tokenCookie);
                req.bearerToken = token;
                next();
            } else {
                res.status(401).json({ message: 'Authentication Failed' });
            }
        } catch (err) {
            console.error('Error while authenticating: ', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = { authenticateUser };

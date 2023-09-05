const axios = require('axios');

module.exports.createSession = function (req, res) {
    const apiUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';
    const params = {
        cmd: 'get_customer_list',
    };
    const token = req.bearerToken;
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    axios.get(apiUrl, { params, headers })
        .then((response) => {
            if (response.status == 200) {
                const customerList = response.data;
                console.log(customerList);
                res.render('customer', {
                    title: 'Customer Info',
                    customerList,
                });
            } else {
                console.error("failed", res.status);
            }
        })
        .catch((err) => {
            console.log(err);
        })

}   
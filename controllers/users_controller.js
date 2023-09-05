const axios = require('axios');
const cookie = require('cookie');

module.exports.createSession = function (req, res) {
    const token = req.bearerToken;
    console.log(token);
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const apiGetUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list';

    axios.get(apiGetUrl, { headers })
        .then(async (response) => {
            if (response.status == 200) {
                const customerList = await response.data;
                console.log(customerList[0]);
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

module.exports.delete = async function (req, res) {
    console.log("delete hit");
    const uuid = req.query.id;
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.access_token || '';
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    if (!uuid) {
        return res.status(400).json({ message: 'UUID not found' });
    }

    const apiDeleteUrl = `https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=${req.query.id}`;

    try {
        await axios(apiDeleteUrl, { headers })
            .then((response) => {
                if (response.status === 200) {
                    return res.status(200).json({ message: 'Successfully deleted' });
                } else if (response.status === 400) {
                    return res.status(400).json({ message: 'UUID not found' });
                } else {
                    return res.status(500).json({ message: 'Error deleting customer' });
                }
            })
    } catch (error) {
        console.error('Delete Customer API Error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.addPage = function (req, res) {
    return res.render('addCustomer', {
        title: "Add Customer",
    })
}

module.exports.addCustomer = function (req, res) {
    const { firstname, lastname, street, address, city, state, email, phone } = req.body;

    const customerData = {
        first_name: firstname,
        last_name: lastname,
        street,
        address,
        city,
        state,
        email,
        phone,
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.access_token || '';
    console.log("cookie", token);

    // Define the API URL for adding a customer
    const apiCreateUrl =
        'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create';

    // Define the headers including the Authorization header
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Define the request body
    const requestBody = {
        ...customerData,
    };

    axios.post(apiCreateUrl, requestBody, { headers })
        .then((response) => {
            if (response.status === 201) {
                return res.status(201).json({ message: 'Successfully Created' });
            } else if (response.status === 400) {
                return res.status(400).json({ message: 'Bad Request: First Name or Last Name is missing' });
            } else {
                console.error('Add Customer API Error:', response.data); // Log the error response
                return res.status(500).json({ message: 'Error creating customer' });
            }
        })
        .catch((err) => {
            console.error('Add Customer API Error:', err.message); // Log the Axios error
            return res.status(500).json({ message: 'Internal server error' });
        });

}

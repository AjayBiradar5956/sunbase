const axios = require('axios');
const apiUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';

module.exports.createSession = function (req, res) {
    const params = {
        cmd: 'get_customer_list',
    };
    const token = req.bearerToken;
    console.log(token);
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    axios.get(apiUrl, { params, headers })
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
    const uuid = req.query.id;
    const params = {
        cmd: 'delete',
        uuid,
    };
    const token = req.bearerToken;
    console.log(token);
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    if (!uuid) {
        return res.status(400).json({ message: 'UUID not found' });
    }

    try {
        await axios(apiUrl, { params, headers })
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
    console.log(req.body);
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

    const params = {
        cmd: 'create',
        ...customerData,
    }
    const token = req.bearerToken;
    const header = {
        Authorization: `Bearer ${token}`,
    }
    axios.post(apiUrl, { params, header })
        .then((response) => {
            if (response.status === 200) {
                return res.status(200).json({ message: 'Successfully Updated' });
            } else if (response.status === 400) {
                return res.status(400).json({ message: 'Body is Empty' });
            } else {
                return res.status(500).json({ message: 'Error updating customer' });
            }
        })
        .catch((err) => {
            console.error('Update Customer API Error:', err.message);
            return res.status(500).json({ message: 'Internal server error' });
        })
}
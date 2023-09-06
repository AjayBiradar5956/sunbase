const axios = require('axios');
const cookie = require('cookie');
const api = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?';

module.exports.addPage = function (req, res) {
    return res.render('addCustomer', {
        title: "Add Customer",
        addPage: true,
    })
}

module.exports.updatePage = function (req, res) {
    const id = req.params.id;
    return res.render('addCustomer', {
        title: "Add Customer",
        addPage: false,
        id,
    })
}

module.exports.getCustomer = function (req, res) {
    const token = req.bearerToken;
    const params = 'cmd=get_customer_list';
    const apiGetUrl = `${api}${params}`;

    axios.get(apiGetUrl, { headers: { Authorization: `Bearer ${token}` } })
        .then(async (response) => {
            if (response.status == 200) {
                const customerList = await response.data;
                res.render('customer', {
                    title: 'Customer Info',
                    customerList,
                });
            } else {
                console.error("failed", res.status);
            }
        })
        .catch((err) => {
            console.log("failed getting customer info", err);
            res.status(500).json({ message: "Internal Server Error" });
        })
}

module.exports.deleteCustomer = function (req, res) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.access_token || '';
    const id = req.params.id;
    const params = `cmd=delete&uuid=${id}`;
    const apiDeleteUrl = `${api}${params}`;

    axios.post(apiDeleteUrl, {}, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
            if (response.status === 200) {
                return res.status(200).json({ message: 'Successfully deleted' });
            } else if (response.status === 400) {
                return res.status(400).json({ message: 'UUID not found' });
            } else {
                return res.status(500).json({ message: 'Error Not Deleted' });
            }
        })
        .catch((err) => {
            console.log("failed Deleting customer", err);
            res.status(500).json({ message: "Internal Server Error" });
        })
}

module.exports.addCustomer = function (req, res) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.access_token || '';
    const params = "cmd=create";
    const apiCreateUrl = `${api}${params}`;

    const uuid = Date.now();
    const { first_name, last_name, street, address, city, state, email, phone } = req.body;
    const customerData = {
        first_name,
        last_name,
        street,
        address,
        city,
        state,
        email,
        phone,
        uuid,
    }

    const requestBody = {
        ...customerData,
    };

    axios.post(apiCreateUrl, requestBody, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
            if (response.status === 201) {
                return res.status(201).json({ message: 'Successfully Created' });
            } else if (response.status === 400) {
                return res.status(400).json({ message: 'First Name or Last Name is missing' });
            } else {
                console.error('Add Customer API Error:', response.data);
                return res.status(500).json({ message: 'Error creating customer' });
            }
        })
        .catch((err) => {
            console.error('Add Customer API Error:', err.message);
            return res.status(500).json({ message: 'Internal server error' });
        });
}

module.exports.modifyCustomer = function (req, res) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.access_token || '';
    const id = req.params.id;
    const params = `cmd=update&uuid=${id}`;
    const apiModifyUrl = `${api}${params}`;

    const { first_name, last_name, street, address, city, state, email, phone } = req.body;

    const customerData = {
        first_name,
        last_name,
        street,
        address,
        city,
        state,
        email,
        phone,
        uuid: req.params.id,
    }

    const requestBody = {
        ...customerData,
    }

    axios.post(apiModifyUrl, requestBody, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
            if (response.status == 200) {
                res.status(200).json({ message: 'Successfully Updated' });
            } else if (response.status === 400) {
                return res.status(400).json({ message: 'Body is Empty' });
            } else {
                console.error('Add Customer API Error:', response.data);
                return res.status(500).json({ message: 'UUID not found' });
            }
        })
        .catch((err) => {
            console.error('Error while updating details', err.message);
            res.status(500).json({ message: "Internal Server Error" });
        })
}
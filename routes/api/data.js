const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const fs = require('fs');



var data = require('../../dataBase/typicode.json');

//returns all data
router.get('/', (req, res) => {
    res.json(data);
});


//returns perticular data of requested serial number
router.get('/:sl', (req, res) => {
    const found = data.some(data => data.serial === parseInt(req.params.sl));

    if (found) {
        res.json(data.filter(data => data.serial === parseInt(req.params.sl)));
    }
    else {
        res.status(404).json({ msg: `404 || data not found at serial number: ${req.params.sl}` });
    }
});


//create new data
router.post('/', (req, res) => {
    const newData = {
        serial: data.length + 1,
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        active: false,
        id: uuid.v4()
    }
    if (!newData.name || !newData.age || !newData.email) {
        return res.status(400).json({ msg: 'Please include serial and Title' })
    }
    data.push(newData);
    res.json(data[data.length - 1]);

    fs.writeFileSync('../dataBase/newData.json', `${data}`);
})


// Update a data
router.put('/:sl', (req, res) => {
    const found = data.some(data => data.serial === parseInt(req.params.sl));

    if (found) {
        const updData = req.body;


        data.forEach(data => {
            if (data.serial === parseInt(req.params.sl)) {
                data.serial = updData.serial ? updData.serial : data.serial;
                data.name = updData.name ? updData.name : data.name;
                data.age = updData.age ? updData.age : data.age;
                data.email = updData.email ? updData.email : data.email;
                data.id = data.id ? data.id : uuid.v4();

                res.json({ msg: 'data updated', data });


            }
        });

        fs.writeFileSync('../dataBase/newData.json', `${data}`);
    }
    else {
        res.status(400).json({ msg: `400 || data not found at serial number: ${req.params.sl}` });
    }

});

// Delete a data
router.delete('/:sl', (req, res) => {
    const found = data.some(data => data.serial === parseInt(req.params.sl));

    if (found) {
        data = data.filter(data => data.serial !== parseInt(req.params.sl));
        res.json({
            msg: 'data deleted',
            data
        });

        fs.writeFileSync('../dataBase/newData.json', `${data}`);
    }
    else {
        res.status(400).json({ msg: `400 || data not found at serial number: ${req.params.sl}` });
    }
});





module.exports = router;
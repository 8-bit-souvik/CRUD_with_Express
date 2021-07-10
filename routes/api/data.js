const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const fs = require('fs');



var data = require('../../dataBase/members.json').data;

//returns all data
router.get('/all', (req, res) => {
    if (req.headers.key === '12345') {
        var viewData = [];
        data.forEach(data => {
            if (data.name !== undefined) {
                viewData.push(data);
            }
        });
        res.json(viewData);
    } else {
        res.status(403).json({ msg: "authentication error" })
    }

});


//returns perticular data of requested serial number
router.get('/:sl', (req, res) => {
    if (req.headers.key === '12345') {

        const foundBySerial = data.some(data => data.serial === parseInt(req.params.sl));
        const foundByName = data.some(data => data.name === (req.params.sl));

        if (foundBySerial) {
            res.json(data.filter(data => data.serial === parseInt(req.params.sl)));
        }
        else if (foundByName) {

            // res.json(data.filter(data => data.name === (req.params.sl)));
            i = 0; nums = [];
            data.forEach(data => {

                if (data.name === (req.params.sl)) {
                    i++;
                    nums.push(data.serial);
                }
            });
            res.json({ msg: ` ${i} people matched with the name of ${req.params.sl} `, serial: `${nums}` });

        } else {
            res.status(404).json({ msg: `404 || data not matched with: ${req.params.sl}` });
        }
    } else {
        res.status(403).json({ msg: "authentication error" })
    }
});


//create new data
router.post('/', (req, res) => {
    if (req.headers.key === '12345') {
        const newData = {
            serial: data.length + 1,
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            active: false,
            joined: Date(),
            id: uuid.v4()
        }

        if (!req.body.name || !req.body.age || !req.body.email) {
            return res.status(400).json({ msg: 'Please include name, age and email' })
        }
        data.push(newData);
        res.json({ msg: 'data pushed', newData });

        fs.writeFileSync('../dataBase/members.json', `${JSON.stringify({ data }, null, 1)}`);
    } else {
        res.status(403).json({ msg: "authentication error" })
    }

})


// Update a data
router.put('/:sl', (req, res) => {
    if (req.headers.key === '12345') {
        const found = data.some(data => data.serial === parseInt(req.params.sl));

        if (found) {
            const updData = req.body;


            data.forEach(data => {
                if (data.serial === parseInt(req.params.sl)) {

                    if (data.name === undefined || data.age === undefined || data.email === undefined || data.active === undefined || data.id === undefined) {
                        res.status(400).json({ msg: `member is already deleted` });
                    } else {
                        data.name = updData.name ? updData.name : data.name;
                        data.age = updData.age ? updData.age : data.age;
                        data.email = updData.email ? updData.email : data.email;
                        data.active = updData.active !== undefined ? updData.active : data.active;    // this cannot be left updData.active, then it will execute that given boolian value
                        data.id = data.id ? data.id : uuid.v4();                                      //if any member's id is not specified in database then while update an uuid will be specified automatically.

                        res.json({ msg: 'data updated', data });
                    }

                }
            });

            fs.writeFileSync('../dataBase/members.json', `${JSON.stringify({ data }, null, 1)}`);
        }
        else {
            res.status(400).json({ msg: `400 || data not found at serial number: ${req.params.sl}` });
        }
    } else {
        res.status(403).json({ msg: "authentication error" })
    }


});

// Delete a data
router.delete('/:sl', (req, res) => {
    if (req.headers.key === '12345') {

        const found = data.some(data => data.serial === parseInt(req.params.sl) && data.name === (req.body.name));

        if (found) {

            //  data = data.filter(data => data.serial !== parseInt(req.params.sl));

            data.forEach(data => {

                if (data.serial === parseInt(req.params.sl) && data.name === (req.body.name)) {

                    //serial number of every member should be unique, so serial number will not be deleted due to avoid complexity.
                    data.name = undefined;
                    data.age = undefined;
                    data.email = undefined;
                    data.active = undefined;
                    data.joined = undefined;
                    data.id = undefined;



                    res.json({ msg: `data deleted at serial number ${data.serial}`, data });
                }
            });


            fs.writeFileSync('../dataBase/members.json', `${JSON.stringify({ data }, null, 1)}`);
        }
        else {
            res.status(400).json({ msg: `400 || data not found at serial number: ${req.params.sl} and name: ${req.body.name}` });
        }
    } else {
        res.status(403).json({ msg: "authentication error" })
    }
});





module.exports = router;
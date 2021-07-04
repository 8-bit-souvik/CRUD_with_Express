const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const fs = require('fs');



var data = require('../../dataBase/members.json').data;

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
        joined: Date(),
        id: uuid.v4()
    }
    if (!newData.name || !newData.age || !newData.email) {
        return res.status(400).json({ msg: 'Please include name, age and email' })
    }
    data.push(newData);
    res.json({ msg: 'data pushed', newData });

    fs.writeFileSync('../dataBase/members.json', `${JSON.stringify({data}, null, 1)}`);
})


// Update a data
router.put('/:sl', (req, res) => {
    const found = data.some(data => data.serial === parseInt(req.params.sl));

    if (found) {
        const updData = req.body;


        data.forEach(data => {
            if (data.serial === parseInt(req.params.sl)) {
                data.name = updData.name ? updData.name : data.name;
                data.age = updData.age ? updData.age : data.age;
                data.email = updData.email ? updData.email : data.email;
                data.active = updData.active !== undefined ? updData.active : data.active;    // this cannot be left updData.active, then it will execute that given boolian value
                data.id = data.id ? data.id : uuid.v4();                                      //if any member's id is not specified in database then while update an uuid will be specified automatically.

                res.json({ msg: 'data updated', data });


            }
        });

        fs.writeFileSync('../dataBase/members.json', `${JSON.stringify({data}, null, 1)}`);
    }
    else {
        res.status(400).json({ msg: `400 || data not found at serial number: ${req.params.sl}` });
    }

});

// Delete a data
router.delete('/:sl', (req, res) => {
    const found = data.some(data => data.serial === parseInt(req.params.sl));

    if (found) {
        
      //  data = data.filter(data => data.serial !== parseInt(req.params.sl));

      data.forEach(data => {
          if (data.serial === parseInt(req.params.sl)) {
              
              //serial number of every member should be unique, so serial number will not be deleted due to avoid complexity.
              data.name = undefined;
              data.age = undefined;
              data.email = undefined;
              data.active = undefined; 
              data.joined = undefined;
              data.id = undefined;     

              res.json({ msg: 'data deleted', data });
          }
      });


        fs.writeFileSync('../dataBase/members.json', `${JSON.stringify({data}, null, 1)}`);
    }
    else {
        res.status(400).json({ msg: `400 || data not found at serial number: ${req.params.sl}` });
    }
});





module.exports = router;
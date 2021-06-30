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
    const found = data.some(data => data.Serial === parseInt(req.params.sl));

    if (found) {
        res.json(data.filter(data => data.Serial === parseInt(req.params.sl)));
    }
    else {
        res.status(404).json({ msg: `404 || data not found at serial number: ${req.params.sl}` });
    }
});


//create new data
router.post('/', (req, res) => {
    const newData = {
        id: uuid.v4(),
        group: 'custom',
        Serial: req.body.Serial,
        Title: req.body.Title,
        Completed: false
    }
    if (!newData.Serial || !newData.Title) {
        return res.status(400).json({ msg: 'Please include serial and Title' })
    }
    data.push(newData);
    res.json(data[data.length - 1]);

    fs.writeFileSync('../dataBase/newData.json', `${data}`);
})


// Update a data
router.put('/:sl', (req, res) => {
    const found = data.some(data => data.Serial === parseInt(req.params.sl));

    if (found) {
        const updData = req.body;


        data.forEach(data => {
            if (data.Serial === parseInt(req.params.sl)) {
                    data.group = updData.group ? updData.group : data.group;
                    data.Serial = updData.Serial ? updData.Serial : data.Serial;
                    data.Title = updData.Title ? updData.Title : data.Title;
                    data.Completed = updData.Completed ? updData.Completed : data.Completed;

                res.json({ msg: 'data updated', data });

                fs.writeFileSync('../dataBase/newData.json', `${data}`);
            }
        });
    }
    else {
        res.status(400).json({ msg: `400 || data not found at serial number: ${req.params.sl}` });
    }

});

// Delete a data
router.delete('/:sl', (req, res) => {
    const found = data.some(data => data.Serial === parseInt(req.params.sl));

    if (found) {
        data = data.filter(data => data.Serial !== parseInt(req.params.sl));
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
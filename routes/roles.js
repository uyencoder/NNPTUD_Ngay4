var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../utils/data');
let { GenID } = require('../utils/idHandler');

/* GET roles listing. */
router.get('/', function (req, res, next) {
    let result = dataRole.filter(e => !e.isDeleted);
    res.send(result);
});

/* GET role by id. */
router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    let result = dataRole.filter(e => e.id == id && !e.isDeleted);

    if (result.length) {
        res.send(result[0]);
    } else {
        res.status(404).send({ message: "ROLE ID NOT FOUND" });
    }
});

/* POST create a role */
router.post('/', function (req, res) {
    let newRole = {
        id: GenID(dataRole),
        name: req.body.name,
        description: req.body.description,
        isDeleted: false,
        creationAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
    };
    dataRole.push(newRole);
    res.status(201).send(newRole);
});

/* PUT update a role */
router.put('/:id', function (req, res) {
    let id = req.params.id;
    let result = dataRole.filter(e => e.id == id && !e.isDeleted);

    if (result.length) {
        let roleItem = result[0];
        let keys = Object.keys(req.body);
        for (const key of keys) {
            if (roleItem[key] !== undefined && key !== 'id') {
                roleItem[key] = req.body[key];
            }
        }
        roleItem.updatedAt = new Date(Date.now());
        res.send(roleItem);
    } else {
        res.status(404).send({ message: "ROLE ID NOT FOUND" });
    }
});

/* DELETE a role */
router.delete('/:id', function (req, res) {
    let id = req.params.id;
    let result = dataRole.filter(e => e.id == id && !e.isDeleted);

    if (result.length) {
        let roleItem = result[0];
        roleItem.isDeleted = true;
        roleItem.updatedAt = new Date(Date.now());
        res.send({ message: "Role deleted successfully", role: roleItem });
    } else {
        res.status(404).send({ message: "ROLE ID NOT FOUND" });
    }
});

/* GET users by role id */
router.get('/:id/users', function (req, res, next) {
    let id = req.params.id;
    // Verify role exists and is not deleted
    let roleExists = dataRole.filter(e => e.id == id && !e.isDeleted);
    if (!roleExists.length) {
        return res.status(404).send({ message: "ROLE ID NOT FOUND" });
    }

    let result = dataUser.filter(e => e.role && e.role.id == id && !e.isDeleted);
    res.send(result);
});

module.exports = router;

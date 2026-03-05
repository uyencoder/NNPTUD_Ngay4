var express = require('express');
var router = express.Router();
let { dataUser } = require('../utils/data');

/* GET users listing. */
router.get('/', function (req, res, next) {
  let result = dataUser.filter(e => e.status !== "deleted" && !e.isDeleted);
  res.send(result);
});

/* GET user by username. */
router.get('/:username', function (req, res, next) {
  let username = req.params.username;
  let result = dataUser.filter(e => e.username === username && !e.isDeleted);

  if (result.length) {
    res.send(result[0]);
  } else {
    res.status(404).send({ message: "USER NOT FOUND" });
  }
});

/* POST create a user */
router.post('/', function (req, res) {
  // Check if username already exists
  let exists = dataUser.filter(e => e.username === req.body.username && !e.isDeleted);
  if (exists.length > 0) {
    return res.status(400).send({ message: "Username already exists" });
  }

  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl || "https://i.sstatic.net/l60Hf.png",
    status: true,
    loginCount: 0,
    role: req.body.role || {
      "id": "r3",
      "name": "Người dùng",
      "description": "Tài khoản người dùng thông thường"
    },
    isDeleted: false,
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  };
  dataUser.push(newUser);
  res.status(201).send(newUser);
});

/* PUT update a user */
router.put('/:username', function (req, res) {
  let username = req.params.username;
  let result = dataUser.filter(e => e.username === username && !e.isDeleted);

  if (result.length) {
    let userItem = result[0];
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (userItem[key] !== undefined && key !== 'username') {
        userItem[key] = req.body[key];
      }
    }
    userItem.updatedAt = new Date(Date.now());
    res.send(userItem);
  } else {
    res.status(404).send({ message: "USER NOT FOUND" });
  }
});

/* DELETE a user */
router.delete('/:username', function (req, res) {
  let username = req.params.username;
  let result = dataUser.filter(e => e.username === username && !e.isDeleted);

  if (result.length) {
    let userItem = result[0];
    userItem.isDeleted = true;
    userItem.status = false;
    userItem.updatedAt = new Date(Date.now());
    res.send({ message: "User deleted successfully", user: userItem });
  } else {
    res.status(404).send({ message: "USER NOT FOUND" });
  }
});

module.exports = router;

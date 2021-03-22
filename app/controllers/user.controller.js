const Users = require('../models/user.model');
const Token = require('../models/token.model')
const crypto = require('crypto');
const bcrypt = require('bcryptjs');


exports.create = async (req, res) => {
    if (req.body.email && req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        req.body.status = 'active'
        var userdata = new Users(req.body)
        console.log("UserData", userdata);
        await userdata.save(
            (err, data) => {
                if (err) {
                    var e = "";
                    if (err.code == 11000) {
                        e = "User already exists with same emailaddress";
                    } else {
                        e = err;
                    }
                    return res.status(400).json({ msg: e });
                }
                var token = new Token({ _userId: userdata._id, token: crypto.randomBytes(16).toString('hex') })
                token.save((err) => {
                    if (err) {
                        return res.status(500).send({ message: err.message });
                    }
                    res.status(200).send({
                        message: 'User created successfully',
                    })
                })
            }
        )
    }
}

exports.findAll = (req, res) => {
    Users.find()
        .select("-password")
        .exec((user, err) => {
            if (err) {
                res.status(500).send(err)
            }
            else if (user.length) {
                res.statue(200).send({ data: user })
            }
            else (res.send({ message: "No data found" }))
        })
}

exports.findOne = (req, res) => {
    Users.findById(req.params.id)
        .select("-password")
        .exec((user, err) => {
            if (!user) {
                res.statue(404).send({ message: "user not found with this id :" + req.params.id })
            }
            else if (user) {
                res.status(200).send(user)
            }
            else (res.status(500).send(err))
        })
}

exports.update = (req, res) => {
    const id = req.params.id;

    Users.findByIdAndUpdate(id, { $set: req.body }, { new: true })
        .select("-password").exec((err, usr) => {
            if (err) res.status(200).send(err);
            else res.status(200).send(usr)
        })
}
exports.delete = (req, res) => {
    const id = req.params.id;
    Users.findByIdAndRemove(id)
        .then(usr => {
            if (!usr) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            res.status(200).send({ message: "User deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete User with id " + req.params.id
            });
        });
}

exports.login = async (req, res) => {
    if (req.body.email && req.body.password) {
        var user = await Users.findOne({ email: req.body.email }).exec();
        if (!user) {
            return res.status(400).send({ message: "The username does not exist" });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).send({ message: "The password is invalid" });
        }
        // Make sure the user has been active
        if (user.status !== 'active')
            return res.status(401).send({ type: 'not-active', message: 'Your account is deactivated.' });

        res.status(200).send({ message: "Login Successfully!" });
    }
    else {
        res.status(500).send({ message: "Could not found data" })
    }
}
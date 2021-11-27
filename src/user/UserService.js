const bcrypt = require("bcrypt");
const User = require("./User");

const save = async (body) => {
    const hash = await bcrypt.hash(body.password, 10);
    const user = { ...body, password: hash };

    // const user = {
    //     username: req.body.username,
    //     email: req.body.email,
    //     password: hash,
    // };

    await User.create(user);
};

const findByEmail = async (email) => {
    return await User.findOne({ email: email });
};

module.exports = { save, findByEmail };

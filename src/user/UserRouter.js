const express = require("express");
const router = express.Router();
const UserService = require("./UserService");
const { check, validationResult } = require("express-validator");

router.post(
    "/api/1.0/users",
    check("username")
        .notEmpty()
        .withMessage("Username cannot be null")
        .bail()
        .isLength({ min: 4, max: 32 })
        .withMessage("Username must have min 4 and max 32 characters"),
    check("email")
        .notEmpty()
        .withMessage("E-mail cannot be null")
        .bail()
        .isEmail()
        .withMessage("E-mail is not valid")
        .custom(async (email) => {
            const user = await UserService.findByEmail(email);
            if (user) {
                throw new Error("E-mail is already in use");
            }
        }),
    check("password")
        .notEmpty()
        .withMessage("Password cannot be null")
        .bail()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .bail()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
        .withMessage(
            "Returns Password must have at least 1 uppercase, 1 lowercase and 1 number"
        ),
    async (req, res) => {
        const errors = validationResult(req);
        const validationErrors = {};
        if (!errors.isEmpty()) {
            errors
                .array()
                .forEach(
                    (error) => (validationErrors[error.param] = error.msg)
                );
            return res.status(400).send({ validationErrors: validationErrors });
        }

        await UserService.save(req.body);
        return res.send({ message: "User created" });
    }
);

module.exports = router;

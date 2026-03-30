const Joi = require("joi");

const singupVal = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),

        role: Joi.string()
            .valid("donor", "needy", "admin")
            .required(),

        password: Joi.string()
            .min(6)
            .max(15)
            .required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            success: false
        });
    }

    next();
};

const loginVal = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),

        password: Joi.string()
            .min(6)
            .max(15)
            .required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            success: false
        });
    }

    next();
};

module.exports={singupVal,loginVal}
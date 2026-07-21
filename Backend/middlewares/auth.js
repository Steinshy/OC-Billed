const { User } = require("../models/index.js");
const jwt = require("../services/jwt.js");

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) return next();
  const [, token] = req.headers.authorization.split(" ");
  try {
    const userPayload = await jwt.isValid(token);
    req.user = await User.findOne({
      where: { email: userPayload?.data?.email },
    });
    return next();
  } catch (_error) {
    return res.status(401).send({
      message: "user not allowed! you should clear your localstorage and retry!",
    });
  }
};

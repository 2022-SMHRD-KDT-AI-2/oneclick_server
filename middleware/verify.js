const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return err;
  }
}

module.exports = (req, res, next) => {
  const { authorization } = req.header;

  if (!authorization)
    return res.status(401).json({
      success: false,
      message: "로그인이 필요합니다.",
    });

  const [tokenType, tokenValue] = authorization.split(" ");

  if (tokenType != "Bearer")
    return res.status(401).json({
      success: false,
      message: "로그인이 필요합니다.",
    });

  try {
    const verified = verifyToken(tokenValue);
    const email = jwt.decode(tokenValue, process.env.JWT_SECRET_KEY).email;
    if (verified == "jwt expired") {
      const user = User.findOne({
        where: {
          email: email,
        },
      });
      if (user.token == "jwt expired") {
        res.send({ errorMessage: "로그인이 필요합니다." });
      } else {
        const newToken = jwt.sign(
          { email: email },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1800s",
          }
        );
        res.send({ token: newToken });
      }
    } else {
      next();
    }
  } catch (err) {
    res.send({ errorMessage: err });
  }
};

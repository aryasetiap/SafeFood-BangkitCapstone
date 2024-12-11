const { verify } = require("jsonwebtoken");
const connection = require("./db");

const secret =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0lkIjoiMTAwNCIsInJvbGVJZCI6IkFETUlOIn0.SZ7h70_AfZk6VJAJTc93mLIqAHFj5umg8yEu84cLYdU";

const validateToken = (req, res, next) => {
  const token = req.headers["auth-token"];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  jwt.verify(token, authorizeUser.secret, (err, decoded) => {
    if (err) {
      return res.status(400).send("Invalid token");
    }
    req.user = decoded;
    next();
  });
};
const authorizeUser = async (token) => {
  try {
    const decoded = verify(token, secret);
    const role = decoded.role;
    let user;

    if (role === "donor") {
      const [results] = (await connection).query(
        "SELECT * FROM recipients WHERE id_penyumbang = ?",
        [decoded.sub]
      );
      user = results[0];
    } else if (role === "recipient") {
      const [results] = (await connection).query(
        "SELECT * FROM recipients WHERE id_penerima = ?",
        [decoded.sub]
      );
      user = results[0];
    } else {
      return { status: 401, message: "Unauthorized" };
    }

    if (!user) {
      return { status: 401, message: "Unauthorized" };
    }
    return { isValid: true, user };
  } catch (error) {
    console.error(error);
    return { isValid: false };
  }
};

module.exports = { authorizeUser, secret };

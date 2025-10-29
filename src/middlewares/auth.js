const adminAuth = (req, res, next) => {
  const token = "xyz";

  const tokenAutohirze = token === "xyzn";

  if (tokenAutohirze) {
    console.log("user is verified");
    next();
  } else {
    res.status(401).send("user is not authorize");
  }
};

module.exports = {
  adminAuth,
};

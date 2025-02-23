const isAdmin = (req, res, next) => {
    console.log("Middleware called. User:", req.session.profile);
    if (req.session.profile) {
      next();
    } else {
      res.status(403).json({ message: "Access denied. please try again" });
    }
};
  
module.exports=isAdmin


  
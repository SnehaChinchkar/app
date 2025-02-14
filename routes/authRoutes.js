const express = require("express");
const { register, login, searchUser ,UserSearchByRequestBody} = require("../controllers/userController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/search/:username", auth, searchUser);
router.post("/find", auth, UserSearchByRequestBody);
module.exports = router;

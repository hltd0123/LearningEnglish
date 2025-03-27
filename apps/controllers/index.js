var express = require("express");
var router = express.Router();
const {isAdmin, isAuthenticated } = require('./../util/checkAdminRole');

// Các route không cần phân quyền
router.use("/home", require(__dirname + "/homecontroller"));
router.use("/about", require(__dirname + "/aboutcontroller"));
router.use("/grammar", require(__dirname + "/grammarcontroller"));
router.use("/pronunciation", require(__dirname + "/pronunciationcontroller"));
router.use("/grammar-exercise",  require(__dirname + "/grammarexercisecontroller"));
router.use("/pronunciation-exercise", require(__dirname + "/pronunciationexercisecontroller"));
router.use("/vocabulary-exercise", require(__dirname + "/vocabularyexercisecontroller"));
router.use("/blog", require(__dirname + "/blogcontroller"));
router.use("/login", require(__dirname + "/usercontroller"));
router.use("/register", require(__dirname + "/usercontroller"));
router.use("/profile", require(__dirname + "/usercontroller")); 
router.use("/profile/update", require(__dirname + "/usercontroller"));
router.use("/flashcards",require(__dirname + "/flashcardcontroller"));
router.use("/chat", require(__dirname + "/chatcontroller"));
router.use("/dictionary", require(__dirname + "/dictionarycontroller"));
router.use("/contact", require(__dirname + "/contactcontroller"));

// Các route cần phân quyền admin
router.use("/admin", require(__dirname + "/admin/homeAdmincontroller"));
router.use("/admin/grammar", require(__dirname + "/admin/grammarAdmincontroller"));
router.use("/admin/grammar-exercise", require(__dirname + "/admin/grammarexerciseAdmincontroller"));
router.use("/admin/pronunciation",require(__dirname + "/admin/pronunciationAdmincontroller"));
router.use("/admin/pronunciation-exercise", require(__dirname + "/admin/pronunciationexerciseAdmincontroller"));
router.use("/admin/vocabulary-exercise", require(__dirname + "/admin/vocabularyexerciseAdmincontroller"));
router.use("/admin/users", require(__dirname + "/admin/userAdmincontroller"));

// Trang admin dashboard
router.get('/admin', (req, res) => {
    res.render('admin/dashboard');
});

router.get('/',(req, res) => {
    res.render('home'); // Hoặc render file tương ứng
});

router.get("/single-blog", function (req, res) {
    res.render("single-blog.ejs");
});

router.get("/single-blog-1", function (req, res) {
    res.render("single-blog-1.ejs");
});
module.exports = router;

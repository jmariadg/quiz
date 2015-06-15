		var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* Get author */
router.get('/author', function(req, res){
	res.render('author', { nombreautor: 'José Mª Domínguez' });
});

/* GET question and answer page */
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);




module.exports = router;

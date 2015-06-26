var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

/* Get author */
router.get('/author', function(req, res){
	res.render('author', { nombreautor: 'José Mª Domínguez', errors: [] });
});

// Autoload de comandos con:quizId
/* Cargo antes el Load para que cuando se llame alguna
 * de las rutas /quizes de más abajo el quizId ya esté localizado
 * En las llamadas con :quizId(//d+) se utiliza la expresión regular par identifiar el númeroId
 */
router.param('quizId', quizController.load);  // autoload :quizId

/* Definición de rutas de /quizes */
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

router.get('/quizes/new', quizController.new);				// primitiva para formulario nueva pregunta
router.post('/quizes/create', quizController.create);		// primitiva para guardar la nueva pregunta
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);	// primitiva para el formulario de edición
router.put('/quizes/:quizId(\\d+)', quizController.update);	// primitiva para la actualización en la base de datos
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);	// primitiva para borrar una pregunta de la tabla quiz


module.exports = router;

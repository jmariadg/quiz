var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. Página de entrada a la aplicación */
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
 *
 * También incluyo un autoload para commentId
 */
router.param('quizId', quizController.load);  // autoload :quizId
router.param('commentId', commentController.load) // autoload :commentId

/* Definición de las rutas para la gestión de sesiones */
router.get('/login', sessionController.new);      // formulario login
router.post('/login', sessionController.create);  // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

/* Definición de rutas de /quizes */
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);


/* Definiciones de rutas para crear, modificar y borrar preguntas */
router.get('/quizes/new', sessionController.loginRequired, quizController.new);				// primitiva para formulario nueva pregunta
router.post('/quizes/create', sessionController.loginRequired, quizController.create);		// primitiva para guardar la nueva pregunta
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);	// primitiva para el formulario de edición
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);	// primitiva para la actualización en la base de datos
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);	// primitiva para borrar una pregunta de la tabla quiz

/* Definición de rutas para los comentarios */
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);  // primitiva para el formulario nuevo comentario
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);  // primitiva para guardar el nuevo comentario
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish); // primitiva para publicar un comentario ya creado en la BD
/* Error en recirect con POST
 * al hacer uso de PUT e intentar aplicar la interfaz REST aparece un error ya que se redirecciona con GET en vez de POST y sobre escribir el método a put
 * Ver comentario /quizes/show.ejs
 * router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish); // primitiva para publicar un comentario ya creado en la BD
*/


module.exports = router;

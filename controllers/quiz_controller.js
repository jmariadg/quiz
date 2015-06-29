
var models = require ('../models/models.js');

var temas = {"otros": "Otros",
  				   "humanidades": "Humanidades",
  				   "ciencia" : "Ciencia",
  				   "tecnologia" : "Tecnología",
  				   "ocio": "Ocio"};


// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId){
	models.Quiz.findById(quizId).then(
		function(quiz) {
			if (quiz){
				req.quiz = quiz;	// req.quiz se utiliza en los exports show y answer
				next();
			}
			else {
				next(new Error('No existe quizId=' + quizId));
			}
		}
		).catch(function(error){next(error);});
};


// GET /quizes/:id
exports.show = function (req, res) {
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/answer
exports.answer = function (req, res){
	var resultado = 'Incorrecto';

	if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes
exports.index = function (req, res) {
	var search = req.query.search;
	var condicionWhere = "";
	
	if(search !== undefined){
	    search = "%" + search + "%"; // para el inicio y fin :)
		search = search.replace(" ","%");

		condicionWhere = {where: ["pregunta like ?", search], order: [['pregunta', 'ASC']]};

	    models.Quiz.findAll(condicionWhere).
	    then(function(quizes){
	         res.render('quizes/index.ejs', { quizes: quizes, errors: [], tablaTemas: temas });
	    });
	}
	else {
	    models.Quiz.findAll().then(function (quizes) {
	    	res.render('quizes/index.ejs', { quizes: quizes, errors: [], tablaTemas: temas });
	 	}).catch(function(error){next(error);});		
	}

};


// controlador para GET /quizes/new
exports.new = function (req, res){
	// build es un método del ORM sequelize que crea un objeto quiz
	var nuevoQuiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
	);

	res.render('quizes/new', {quiz: nuevoQuiz, errors: [], tablaTemas: temas});
};

// controlador para POST /quizes/create
exports.create = function (req, res){
	// build es un método del ORM sequelize quecrea un objeto quiz.
	// req.body.quiz contendrá los datos enviados desde form.ejs
	var nuevoQuiz = models.Quiz.build (req.body.quiz);

	nuevoQuiz.validate().then(
		function(err){
			if (err){
				res.render('quizes/new', {quiz: nuevoQuiz, errors: err.errors});
			}
			else {
				// guarda en DB los campos pregunta y respuesta, cuando termina 
				// redirecciona a la página principal con el listado de preguntas
				nuevoQuiz.save({fields:["pregunta", "respuesta", "tema"]}).then(function(){
					res.redirect('/quizes');
				});				
			}
	});
};

// GET /quizes/:id/edit
exports.edit = function (req, res) {
	var objQuiz = req.quiz; // el objeto quiz de request trae la pregunta, la respuesta y el tema

	res.render ('quizes/edit', {quiz: objQuiz, errors: [], tablaTemas: temas});
};

exports.update = function (req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate()
	.then(function(err){
		if (err){
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		}
		else{
			req.quiz 	
			.save({fields: ["pregunta", "respuesta", "tema"]})	  // save guarda los campos pregunta y respuesta en la BD
			.then(function(){res.redirect('/quizes')});   // si se graba redirecciona http a la página de listado de preguntas
		}
	});
};

// DELETE /quizes/:id
exports.destroy = function (req, res) {
	req.quiz.destroy()
	.then(function(){
		res.redirect('/quizes');
	})
	.catch(function(error){
		next(error)
	});
};
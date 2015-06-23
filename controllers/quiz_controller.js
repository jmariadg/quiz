var models = require ('../models/models.js');

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
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/answer
exports.answer = function (req, res){
	var resultado = 'Incorrecto';

	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
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
	         res.render('quizes/index.ejs', { quizes: quizes });
	    });
	}
	else {
	    models.Quiz.findAll().then(function (quizes) {
	    	res.render('quizes/index.ejs', { quizes: quizes });
	 	}).catch(function(error){next(error);});		
	}

};


// controlador para GET /quizes/new

exports.new = function (req, res){
	// build es un método del ORM sequelize que crea un objeto quiz
	var nuevoQuiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);

	res.render('quizes/new', {quiz: nuevoQuiz});
};

// controlador para POST /quizes/create

exports.create = function (req, res){
	// build es un método del ORM sequelize quecrea un objeto quiz.
	// req.body.quiz contendrá los datos enviados desde form.ejs
	var nuevoQuiz = models.Quiz.build (req.body.quiz);

	// guarda en DB los campos pregunta y respuesta, cuando termina 
	// redirecciona a la página principal con el listado de preguntas
	nuevoQuiz.save({fields:["pregunta", "respuesta"]}).then(function(){res.redirect('/quizes');});
};
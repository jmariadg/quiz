var path = require('path');

// Cargo el modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize (null, null, null, {dialect:"sqlite", storage: "quiz.sqlite"});

// Importar la definición de la tabla Quiz en quiz.js

var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz;

// creo e inicializo la tabla de preguntas en DB
sequelize.sync().then(function() {
	Quiz.count().then(function(count){
		if (count === 0) {
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			}).then(function(){console.log('Base de datos inicio')});
		};
	});
});
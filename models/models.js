var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// Sqlite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name	= (url[6]||null);
var user	= (url[2]||null);
var pwd		= (url[3]||null);
var protocol= (url[1]||null);
var dialect	= (url[1]||null);
var port	= (url[5]||null);
var host	= (url[4]||null);
var storage	= process.env.DATABASE_STORAGE;

// Cargo el modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize (DB_name, user, pwd,
	{dialect: dialect,
	 protocol: protocol,
	 port: port,
	 host: host,
	 storage: storage,	// solo SQLite .env
	 omitNull: true		// solo Postgres
	});

// Importar la definición de la tabla Quiz en quiz.js

var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz;

// creo e inicializo la tabla de preguntas en DB
sequelize.sync().then(function() {
	Quiz.count().then(function(count){
		if (count === 0) {
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				tema: 'humanidades'
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				tema: 'humanidades'			
			});
			Quiz.create({
				pregunta: 'En que año se descubrió el ADN',
				respuesta: '1869',
				tema: 'ciencia'		
			});
			Quiz.create({
				pregunta: 'Quién fue el premio Nobel de Medicina en 1906',
				respuesta: 'Santiago Ramón y Cajal',
				tema: 'ciencia'		
			});
			Quiz.create({
				pregunta: 'Cuántos bytes tiene 1 Kilobyte',
				respuesta: '1024',
				tema: 'tecnologia'		
			})		
			.then(function(){console.log('Base de datos inicio')});
		};
	});
});
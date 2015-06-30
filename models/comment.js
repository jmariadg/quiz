/* Definicióon del módelo de Comment con validación.
   Internamente en la base de datos también se guarda un campo identificador ID.
*/

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Comment',
    { texto: {
        type: DataTypes.STRING,
        validate:{notEmpty: {msg: "-> Falta Comentario"}}
      }
    }
  );
}
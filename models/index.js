'use strict';

const util = require(__BASEDIR+'/util');
const path = require('path');
const Sequelize = require('sequelize');
const db = {};

//--- db connection configuration
let sequelize = new Sequelize(__DB_NAME, __DB_ID, __DB_PW, {
	host: __DB_HOST,
	port: __DB_PORT,
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});
//--------

//
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Model 연결
db.Product = require(__BASEDIR+'/models/product')(sequelize, Sequelize);

module.exports = db;

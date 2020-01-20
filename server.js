/*jshint esversion: 6 */

//--- import libraries
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const util = require(__dirname+'/util');
//----------

//--- global constants & 환경변수 셋팅
global.__BASEDIR = __dirname + '/';
global.__ACCESS_TOKEN_NAME = "x-access-token";
global.__DB_HOST = process.env.DB_HOST || '169.56.115.153';
global.__DB_PORT = process.env.DB_PORT || '32767';
global.__DB_NAME = process.env.DB_NAME || "mvp";
global.__DB_ID = process.env.DB_ID || 'root';
global.__DB_PW = process.env.DB_PW || 'happy@cloud';
const port = (process.env.PORT || 8888);
//const port = 8889;
const JWT_SECRET = process.env.JWT_SECRET || "MySecretKey";
//--------

//---- 기본 library 셋팅
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
//-----------

//--- swagger
app.use(require(path.join(__BASEDIR, "/swagger/index.js")));
//-----------

//----- middle ware: routing되는 서버모듈 시작 전에 항상 수행 - 인증토큰검증
app.use(function(req, res, next) {
	var pathname = req.url;
	util.log("Request for [" + pathname + "] received.");
	
	//-- for liveness, readiness probe
	if(pathname === "/") {
		res.writeHead(200, { 'Content-Type':'text/html; charset=utf-8' });
		res.write('I am alive');
		res.end();
		next();
		return;		
	}

	//-- support cross domain
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'content-type, '+__ACCESS_TOKEN_NAME);
	//-------------
	
	//-- access api docs
	if(pathname === "/api-docs") {
		next();
		return;
	}
	
    //----- Access Token을 읽어 인증여부, Token유효성을 체크함
	let accessToken = req.header(__ACCESS_TOKEN_NAME);
    let token = ((typeof accessToken) == "undefined" || accessToken==""?"":accessToken.toString());
    util.log("access token:"+token);

    if(token == "") {
    	//-- return 인증token 에러
    	util.log("CAN'T GET ACCESS TOKEN");
    	res.json({
    		success: false,
    		msg: "CAN'T GET ACCESS TOKEN"
    	});
		next();
    	return;
	} 
	jwt.verify(token, JWT_SECRET, function(err, decoded) {
		if (err) {
			//Token이 유효하지 않은 경우 
			res.json({
				success: false,
				msg: "INVALID TOKEN"
			});
		} else {
			util.log("success to verify");
			next();
		}
	});	
});
//-------------

//---- Create Database && Table생성 
let sequelize;
console.log(__DB_HOST+":"+__DB_PORT+"->"+__DB_ID+","+__DB_PW);
mysql.createPool({
	connectionLimit: 10,
	host: __DB_HOST,
	port: __DB_PORT,
	user: __DB_ID,
	database: "",				//db가 최초에는 없으므로 빈값으로 
	password: __DB_PW
})
.query('CREATE DATABASE IF NOT EXISTS '+__DB_NAME+' default character set utf8;')
.then(() => {
	//Table생성
	console.log("create table");
	sequelize = require(path.join(__BASEDIR, '/models/index.js')).sequelize;
	sequelize.sync();
	
});
//--------------------------------------
 
//---- Import APIs: base path를 /api/products로 함
app.use('/api/products', require(path.join(__BASEDIR, '/api/prod-bizlogic')));
//-----------

//----- start web server 
app.listen(port, () => {
	console.log('Listen: ' + port);
});
//----------------
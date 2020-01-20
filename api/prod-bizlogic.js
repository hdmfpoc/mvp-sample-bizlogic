/*jshint esversion: 6 */

const express = require('express');
const bodyParser = require('body-parser');
const util = require(__BASEDIR + '/util');
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

const { Product } = require(__BASEDIR + '/models');

//-- Entries Count
router.get("/count", (req, res) => {
	util.log("Get Entry count");
	Product.count()
		.then((cnt) => {
			util.log("count =>" + cnt);
			res.json({
				success: true,
				msg: "",
				value: cnt
			})
		});
});
//-----------

//-- Entry List
router.get("/entries", (req, res) => {
	util.log("Get Entries");

	Product.findAll({
		offset: parseInt(req.query.offset),
		limit: parseInt(req.query.limit),
		order: [
			req.query.order
		]
	})
	.then((data) => {
		res.json({
			success: true,
			msg: "",
			value: data
		})
	})
	.catch((error) => {
		res.json({
			success: false,
			msg: error,
			value: ""
		});
	});
});
//------------

//--- Create entry
router.post("/insert", (req, res) => {
	util.log("새로운 상품 저장");

	var data = '';

	req.on('data', function (chunk) {
		data += chunk;
	});

	req.on('end', function () {
		console.log('POST data received');
		//console.log(data);
		doCreate(JSON.parse(data));
	});

	let doCreate = function(body) {
		Product.create(body)
		.then((data) => {
			util.log("Success to save data!");			
			res.json({
				success: true,
				msg: "",
				value: data
			})
		})
		.catch((error) => {
			console.error(error);
			res.json({
				success: false,
				msg: error,
				value: ""
			});
		});
	}

});
//----------

//--- Get Entry
router.get("/detail", (req, res) => {
	util.log("상품정보 조회");
	let prodId = req.query.prod_id;

	Product.findOne({ where: {id: prodId} })
	.then((data) => {
		console.log(JSON.stringify(data));
		res.json({
			success: true,
			msg: "",
			value: data
		})
	})
	.catch((error) => {
		console.error(error);
		res.json({
			success: false,
			msg: error,
			value: ""
		});
	});

});

//--- Update entry
router.post("/edit", (req, res) => {
	util.log("상품 정보 수정");

	var data = '';

	req.on('data', function (chunk) {
		data += chunk;
	});

	req.on('end', function () {
		console.log('POST data received');
		doUpdate(JSON.parse(data));
	});

	let doUpdate = function(body) {
		Product.update( body,
		{
			where: { id: req.query.prod_id }
		})
		.then((data) => {
			util.log("Success to update data!");			
			res.json({
				success: true,
				msg: "",
				value: data
			})
		})
		.catch((error) => {
			console.error(error);
			res.json({
				success: false,
				msg: error,
				value: ""
			});
		});
	}
});

//--Destroy entry
router.get("/delete", (req, res) => {
	util.log("상품 삭제");

	let prodId = req.query.prod_id;

	Product.destroy({ where: {id: prodId} })
	.then((data) => {
		res.json({
			success: true,
			msg: "",
			value: ""
		})
	})
	.catch((error) => {
		console.error(error);
		res.json({
			success: false,
			msg: error,
			value: ""
		});
	});	
});

module.exports = router;

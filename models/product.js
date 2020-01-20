module.exports =(sequelize, DataTypes) => {
	return sequelize.define('prod', 
	{
		prod_name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: false,
		},
		prod_no: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		prod_section: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},
		author_id: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},
		author_name: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},		
	}, {
		timestamps: false,			//테이블을 생성한 후 자동적으로 createdAt, updatedAt 정보 생성하여 table의 생성 / 최종수정 시간을 기록함 
		paranoid: false,				//테이블에 deletedAt 컬럼이 자동생성됨. record삭제 시 삭제 시간 기록되고 record를 물리적으로 삭제하지 않음
	    underscored: true,			//column명을 camelCase가 아닌 underscore방식으로 사용함
	    tableName: 'prod',		//아래 freezeTableName을 true로 하고 tableName을 지정. freezeTableName이 false(기본값)이면 .define뒤의 값이 talbe명임
	    freezeTableName: true	    
	});
};



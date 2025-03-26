const{Model,DataTypes}=require("sequelize");
const connection=require("./db");

class Event extends Model{}

Event.init(
  {
    name:{
      type:DataTypes.STRING,
    },
    organizer:{
      type:DataTypes.STRING,
    },
    startDate:{
      type:DataTypes.DATE,
    },
    endDate:{
      type:DataTypes.DATE,
    },
    adress:{
      type:DataTypes.STRING,
    }
  },
  {
    tableName:"events",
    sequelize:connection,
    timestamps: false,
  }
);

module.exports=Event;

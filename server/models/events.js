const{Model,DataTypes}=require("sequelize");
const connection=require("./db");

class Event extends Model{}

Event.init(
  {
    nom:{
        type:DataTypes.STRING,
    },
    organisateur:{
      type:DataTypes.STRING,
    },
    dateDebut:{
      type:DataTypes.DATE,
    },
    dateFin:{
      type:DataTypes.DATE,
    },
    adresse:{
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

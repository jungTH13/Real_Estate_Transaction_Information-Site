'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


const sequelize = new Sequelize(config.database, config.username, config.password, config);

const User=require('./user')
const Location=require('./location')


User.init(sequelize);
Location.init(sequelize);

db.User=User;
db.Location=Location;
db.LocationForm={};


db.sequelize = sequelize;

module.exports = db;

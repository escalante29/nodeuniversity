const mongoose = require('mongoose');
const express = require('express');
const validator = require('validator');
const app = express();
const Schema = mongoose.Schema;
const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		validate: [validator.isEmail, 'Invalid Email Address'],
		required: 'Please supply an email address'
	},
	name: {
		type: String,
		required: 'Please supply a name',
		trim: true
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date
});
const User = mongoose.model('User', userSchema);


const dbURI = 'mongodb://admin:mongo18@localhost:27017/site?authSource=admin';

// Connect to our Database and handle an bad connections
mongoose.connect(dbURI);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

app.get('/users', async (req, res, next) => {
	return res.json(await User.find())
})

mongoose.connection.on('connected', (x) => {
	console.log('mongoose connected successfully ', x)
	User.find().then(x => console.log(x));
})

// Start our app!
const port =  process.env.PORT || 80;
console.log(`port set to: ${port}`);
app.set('port', port);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${port}`);
});
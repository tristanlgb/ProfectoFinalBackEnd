const mongoose = require('mongoose');

const uri = 'mongodb+srv://tristanlgb:hola123@products.fwel2.mongodb.net/?retryWrites=true&w=majority&appName=products';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

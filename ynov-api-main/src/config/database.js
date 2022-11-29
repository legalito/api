import mongoose from 'mongoose'

mongoose.connect("mongodb+srv://admin:root@cluster0.sz5n4ea.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log('Succesfully connected to database'))
  .catch((e) => console.log(`Error during database connection : ${e}`))

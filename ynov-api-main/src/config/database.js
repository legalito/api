import mongoose from 'mongoose'

mongoose.connect("mongodb+srv://root:root@cluster0.klqpqcw.mongodb.net/test")
  .then(() => console.log('Succesfully connected to database'))
  .catch((e) => console.log(`Error during database connection : ${e}`))

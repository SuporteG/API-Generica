const mongoose = require('mongoose')


try {
    // mongoose.connect('mongodb+srv://user:pass@clustersg.fo0fv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then( () => {
    //     console.log('mongoo conected')
    // } )
  } catch (error) {
    console.log(error);
  }
mongoose.Promise = global.Promise

module.exports = mongoose;
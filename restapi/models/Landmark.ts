
const mongose = require("mongoose");
const landmarkSchema = new mongose.Schema({
    name : {type:String, require: true},
    category : {type:String, require: true},
    latitude : {type:Number, require: true},
    longitude : {type:Number, require: true},
    webID: {type:String, require: true},}
);
module.exports = mongose.model("Landmark", landmarkSchema);

const mongoose=require("mongoose")

const Schema=mongoose.Schema

const NeddyInfo=new Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    //image
     image:{type:String},
    //basic
    name:{type:String,required:true},
     gender:{type:String,required:true},
    mobile_no:{type:Number,required:true },
    //address
    state:{type:String,required:true},
    city:{type:String,required:true},
    full_address:{ type:String, required:true },
    //other-details
    disease:{type:String,required:true},
    medicine:{type:String,required:true},
    DiseaseRefimage:{type:String},
    note:{type:String,required:false}

})

const NeddyInfoModel=mongoose.model("NeddyInfo",NeddyInfo)

module.exports=NeddyInfoModel;
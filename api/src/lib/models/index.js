const mongoose =require('mongoose');

const { Schema } = mongoose

module.exports.getMongoose =  async function getMongoose() {
  await mongoose.connect(process.env.MONGODB_URI);

  const Match = mongoose.model('Match', MatchSchema);
  const Round = mongoose.model('Round', RoundSchema);

  return {
    Match,
    Round,
  }
}


const ObjectId = Schema.ObjectId;

const RoundSchema = new Schema({
  
})

const PlayerSchema = new Schema({
  id: ObjectId,
  steamId: String,
  rank: Number,
})


const MatchSchema = new Schema({
  id: {type: String, required: true, unique: true},
  type: {type: String, required: true, enum: ['faceit', 'live']},
  demoUrl: {type: String, required: true},
  rounds: [RoundSchema],
  team1: [PlayerSchema],
  team2: [PlayerSchema]
})


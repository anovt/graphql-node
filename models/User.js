const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const CounterSchema = new mongoose.Schema({
//   _id: { type: String, required: true },
//   seq: { type: Number, required: true, default: 0 },
// });

// const Counter = mongoose.model("Counter", CounterSchema);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// UserSchema.pre("save", async function () {
//   if (!this.isNew || this.userId != null) return;

//   const counter = await Counter.findOneAndUpdate(
//     { _id: "userId" },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );

//   this.userId = counter.seq;
// });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  //next();
  return
});

// Compare password method
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);

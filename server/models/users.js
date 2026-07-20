const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // not required for accounts created through Google sign-in
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// hash the password automatically before saving, but only if it changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// helper to check a plain-text password against the stored hash
userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) return Promise.resolve(false); // Google-only account
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

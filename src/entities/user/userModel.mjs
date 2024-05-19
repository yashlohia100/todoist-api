import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        // Only works on .create() and .save()
        validator: function (value) {
          return value === this.password;
        },
        message: 'Passwords do not match!',
      },
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

// Document middleware
// Pre save hook or pre save middleware
// `this` refers to the current document that is being saved
// Hash password if the password field is modified or is new
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
  }

  next();
});

userSchema.methods.checkPassword = async function (candidatePassword) {
  const isCorrect = await bcrypt.compare(candidatePassword, this.password);
  return isCorrect;
};

userSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

const User = model('User', userSchema);
export default User;

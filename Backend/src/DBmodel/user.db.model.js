import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: { // ✅ Use lowercase for consistency
    type: String
  },
  userName: {
    type: String,
    required: true,
    unique: true
    // ❌ remove `reque`, it’s invalid
  },
  mobile: {
    type: String,
    maxlength: 12,
    required: true,
    unique: true
  },
  DOB: {
    type: Date
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isEmailverified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // ✅ Fix typo: `minLenght` → `minlength`
  },
  SCoin: {
    type: Number,
    default: 0,
    min: 0
  },
  GCoin: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;

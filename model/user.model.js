import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
            validator: (v) => {
                return /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(v);
            },
            message: (props) => `${props.value} is not a valid email`,
        },
        unique: [true, 'Email must be unique'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    phone: {
        type: Number,
        default: 1010101010101,
    },
    role: {
        type: String,
        default: 'Resume designer',
    },
    isSocialLogIn: {
        type: Boolean,
        default: false, 
    },
    profile: {
        type: String,
        default: 'https://i.ibb.co/vZG28db/user.webp',
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;

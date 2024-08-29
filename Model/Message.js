// backend/models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: false 
    }
}, { timestamps: true });


const Message=mongoose.model("Message",messageSchema)
export default Message

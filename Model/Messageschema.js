// import mongoose from 'mongoose';


// const messageSchema = new mongoose.Schema({
//     sender_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     content: {
//         type: String,
//         required: true
//     },
//     sent_at: {
//         type: Date,
//         default: Date.now
//     }
// });

// const chatSchema = new mongoose.Schema({
//     student_id: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User', 
//         required: true 
//     },
//     admin_id: {  
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User', 
//         required: true 
//     },
//     messages: [messageSchema], 
//     started_at: { 
//         type: Date, 
//         default: Date.now 
//     },
//     updated_at: { 
//         type: Date, 
//         default: Date.now 
//     }
// });

// // Middleware to update the 'updated_at' field before saving
// chatSchema.pre('save', function(next) {//Pre-save middleware runs before a document is saved
//     this.updated_at = Date.now();  // Set 'updated_at' to the current date and time
//     next();
// });

// // Create the Chat model
// const Chat = mongoose.model('Chat', chatSchema);

// export default Chat

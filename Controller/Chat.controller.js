// import Chat from "../Model/Messageschema.js";
import { User } from './../Model/User.schema.js';
import sendMail from "../Service/Nodemailer.js";
import { sendChatNotification, sendReplyNotification } from "../Service/Chatnotification.js";
import Message from "../Model/Message.js";
import mongoose from "mongoose";

export const createChat = async (req, res) => {
    try {
        const { student_id, admin_id } = req.body;

        // Validate that both users exist
        const student = await User.findById(student_id);
        const admin = await User.findById(admin_id);

        if (!student || !admin) {
            return res.status(404).json({ message: 'User(s) not found' });
        }

        const chat = new Chat({ student_id, admin_id });
        await chat.save();
        res.status(201).json(chat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// export const getMessages = async (req, res) => {
//     try {
//         const { chatId } = req.params;

//         const chat = await Chat.findById(chatId).populate('messages.sender_id', 'username');
//         if (!chat) return res.status(404).json({ message: 'Chat not found' });

//         res.status(200).json(chat.messages);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     } 
// };

export const getChatsForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const chats = await Chat.find({
            $or: [{ student_id: userId }, { admin_id: userId }]
        }).populate('student_id admin_id messages.sender_id');

        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const addMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { sender_id, content } = req.body;

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        chat.messages.push({ sender_id, content });
        chat.updated_at = Date.now(); // Update the timestamp

        await chat.save();
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const emailtest=async (req, res) => {
    const { email, subject, text } = req.body;

    try {
        await sendMail(email, subject, { otp: text, name: 'Test User' }); // Sending a test email
        res.status(200).json({ message: 'Test email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send test email', error: error.message });
    }
  };


  
 // src/controllers/messageController.js
 export const sendMessage = async (req, res) => {
    const { from, to, content } = req.body;

    try {
        if (!from || !to || !content) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const sender = await User.findById(from);
        const recipient = await User.findById(to);

        if (!sender) {
            return res.status(404).json({ error: 'Sender not found' });
        }
        if (sender.role !== 'user') {
            return res.status(403).json({ error: 'Only user can send messages' });
        }

        if (!recipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        const newMessage = new Message({ from, to, content });
        await newMessage.save();

        // Optionally, send a notification to the admin
        if (recipient.role === 'admin') {
             await sendChatNotification(sender, recipient, content);
        }

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};


export const replyToMessage = async (req, res) => {
    const { replyTo, from, content } = req.body;

    try {
       

        const sender = await User.findById(from);
        const recipient = await User.findById(replyTo);
        if (!recipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        if (!sender || sender.role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can send replies' });
        }

        if (!recipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        const replyMessage = new Message({
            from,
            to: replyTo, 
            content
        });
        await replyMessage.save();

        // Optionally, send a notification to the original sender
        await sendReplyNotification(recipient, sender, content);

        res.status(200).json({ message: 'Reply sent successfully' });
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).json({ error: 'Failed to send reply' });
    }
};
export const getMessage = async (req, res) => {
    const { userId, recipientId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(recipientId)) {
            return res.status(400).json({ error: 'Invalid userId or recipientId format' });
        }

        const messages = await Message.find({
            $or: [
                { from: userId, to: recipientId },
                { from: recipientId, to: userId }
            ]
        }).populate('from', 'name email').populate('to', 'name email');

        if (messages.length === 0) {
            return res.status(404).json({ message: 'No messages found' });
        }        

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};     // backend/controllers/chatController.js
// import Message from '../models/Message.js';

export const getChatParticipants = async (req, res) => {
    try {
        const adminId = req.user._id; // Assuming req.user contains the logged-in admin's info

        // Find all distinct user IDs who have sent messages to the admin
        const participants = await Message.find({ to: adminId })
            .populate('from', 'name email') // Populate with user details (name, email)
            .distinct('from'); // Get distinct user IDs from the 'from' field
 
        // Respond with the list of participants
        res.status(200).json({message:participants});
    } catch (error) {
        console.error('Error fetching chat participants:', error);
        res.status(500).json({ message: 'Server error' });
    }
};  
 
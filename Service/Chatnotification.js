import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
});

export const sendChatNotification = async (student, mentor, messageContent) => {
    const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Chat Message</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
            h1 { color: #4CAF50; text-align: center; }
            .message { border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; color: #888; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>New Chat Message</h1>
            <p>Dear ${mentor.name},</p>
            <p>You have received a new message from your student, ${student.name}.</p>
            <div class="message">
                <p><strong>Message:</strong></p>
                <p>${messageContent}</p>
            </div>
            <div class="footer">
                <p>Thank you for using our service!</p>
                <p>If you have any questions, please reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: mentor.email,
        subject: 'New Chat Message Notification',
        html: emailContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Chat notification email sent successfully');
    } catch (error) {
        console.error('Error sending chat notification email:', error);
        throw new Error('Email sending failed');
    }
};    

export const sendReplyNotification = async (student, mentor, messageContent) => {
    const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Reply</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
            h1 { color: #4CAF50; text-align: center; }
            .message { border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; color: #888; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>New Reply</h1>
            <p>Dear ${student.name},</p>
            <p>You have received a reply from your mentor, ${mentor.name}.</p>
            <div class="message">
                <p><strong>Message:</strong></p>
                <p>${messageContent}</p>
            </div>
            <div class="footer">
                <p>Thank you for using our service!</p>
                <p>If you have any questions, please reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: student.email,
        subject: 'New Reply Notification',
        html: emailContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reply notification email sent successfully');
    } catch (error) {
        console.error('Error sending reply notification email:', error);
        throw new Error('Email sending failed');
    }
};

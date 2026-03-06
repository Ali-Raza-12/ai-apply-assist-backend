import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendEmail = async ({ to, subject, html, attachments }) => {
    try {
        const mailOptions = {
            from: `<${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments: attachments.map(att => ({
                filename: att.filename,
                path: att.path,
                contentType: att.contentType || 'application/pdf'
            })),
        };
        const info = await transporter.sendMail(mailOptions);
        
        return { 
            success: true, 
            messageId: info.messageId 
        };
        
    } catch (error) {
        return { 
            success: false, 
            error: error.message,  
            code: error.code,
            responseCode: error.responseCode
        };
    }
};

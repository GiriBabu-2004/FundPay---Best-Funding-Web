import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const upload = multer({
  dest: 'tmp/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

router.post('/contact', upload.single('screenshot'), async (req, res) => {
  try {
    const { issue, description } = req.body;
    const screenshot = req.file;

    if (!issue || !description) {
      return res.status(400).json({ message: 'Issue and description are required' });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // or any email you want to receive to
      subject: `New issue reported: ${issue}`,
      text: `Problem Statement:\n${description}`,
      attachments: screenshot
        ? [{ filename: screenshot.originalname, path: screenshot.path }]
        : [],
    };

    await transporter.sendMail(mailOptions);

    if (screenshot) {
      fs.unlinkSync(screenshot.path); // remove temp file
    }

    res.status(200).json({ message: 'Issue reported successfully' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

export default router;

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, name, isSignup } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (isSignup) {
      if (user) {
        return NextResponse.json({ error: 'User already exists. Please log in.' }, { status: 400 });
      }
      if (!name) {
        return NextResponse.json({ error: 'Name is required for signup.' }, { status: 400 });
      }
      // Create user
      user = await prisma.user.create({
        data: { email, name },
      });
    } else {
      if (!user) {
        return NextResponse.json({ error: 'User not found. Please sign up.' }, { status: 404 });
      }
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP before storing for security
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save to DB
    // Remove existing OTPs for this email to prevent multiple valid OTPs
    await prisma.oTP.deleteMany({ where: { email } });
    
    await prisma.oTP.create({
      data: {
        email,
        otp: hashedOtp,
      },
    });

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or configured service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Flixie Login OTP',
      text: `Your OTP for Flixie is ${otp}. It is valid for 5 minutes.`,
      html: `<h3>Welcome to Flixie!</h3><p>Your OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

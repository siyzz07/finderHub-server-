import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        const adminEmail = 'admin123@gmail.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const admin = new User({
                username: 'system_admin',
                email: adminEmail,
                password: '1234567',
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created successfully!');
        } else {
            existingAdmin.role = 'admin';
            existingAdmin.password = '1234567'; 
            await existingAdmin.save();
            console.log('Admin user already exists, updated password and role.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();

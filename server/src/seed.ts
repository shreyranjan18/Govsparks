import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Challenge from './models/Challenge';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/govspark');
        console.log('MongoDB Connected');

        // Create Government User
        const govEmail = 'admin@ministry.gov';
        let govUser = await User.findOne({ email: govEmail });

        if (!govUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);

            govUser = await User.create({
                username: 'MinistryAdmin',
                email: govEmail,
                password: hashedPassword,
                role: 'government',
                organization: 'Ministry of Innovation'
            });
            console.log('Government User Created');
        } else {
            console.log('Government User already exists');
        }

        const challenges = [
            {
                title: 'AI-Powered Traffic Management System',
                description: 'We are looking for an AI solution to optimize traffic light timings in real-time based on vehicle flow to reduce congestion in the city center by 30%.',
                department: 'Ministry of Transport',
                sector: 'Smart City',
                status: 'open',
                createdBy: govUser._id
            },
            {
                title: 'Blockchain Land Registry Platform',
                description: 'A secure, immutable ledger system to record land ownership and transactions to prevent fraud and streamline property transfers.',
                department: 'Land Department',
                sector: 'Governance',
                status: 'open',
                createdBy: govUser._id
            },
            {
                title: 'Remote Telemedicine for Rural Clinics',
                description: 'Develop a low-bandwidth telemedicine platform that allows doctors in variable connectivity areas to consult with patients effectively.',
                department: 'Ministry of Health',
                sector: 'Healthcare',
                status: 'open',
                createdBy: govUser._id
            },
            {
                title: 'Smart Waste Collection Optimization',
                description: 'IoT-based sensors for waste bins to optimize collection routes, saving fuel and ensuring cleaner streets.',
                department: 'Municipal Corporation',
                sector: 'Sustainability',
                status: 'open',
                createdBy: govUser._id
            }
        ];

        await Challenge.insertMany(challenges);
        console.log('Sample Challenges Added');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './models/Item.js';
import User from './models/User.js';

dotenv.config();

const items = [
    {
        title: 'MacBook Pro 14"',
        description: 'Lost my silver MacBook Pro 14-inch in a black leather case. It has a distinctive "Apple Developer" sticker on the bottom left corner.',
        type: 'Lost',
        category: 'Electronics',
        location: 'Tech Park Cafe, San Francisco',
        image: 'https://images.unsplash.com/photo-1517336712461-755dfcc511e3?w=800&auto=format'
    },
    {
        title: 'Golden Retriever',
        description: 'Friendly golden retriever found wandering near the lake. No collar, but very well behaved.',
        type: 'Found',
        category: 'Pets',
        location: 'Central Park, NY',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format'
    },
    {
        title: 'Car Keys (Tesla)',
        description: 'Found a Tesla key fob on the sidewalk near the entrance of the mall.',
        type: 'Found',
        category: 'Personal',
        location: 'Downtown Mall, NY',
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format'
    },
    {
        title: 'Leather Wallet',
        description: 'Lost my brown leather Fossil wallet. Contains ID and some cards. Last seen at the metro station.',
        type: 'Lost',
        category: 'Personal',
        location: 'Metro Station, London',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format'
    },
    {
        title: 'iPhone 15 Case',
        description: 'Found a transparent iPhone 15 case with some glitter on it. Left on a table at the library.',
        type: 'Found',
        category: 'Electronics',
        location: 'Public Library, Tokyo',
        image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format'
    },
    {
        title: 'Sunglasses',
        description: 'Found Ray-Ban sunglasses on the beach near the pier.',
        type: 'Found',
        category: 'Accessories',
        location: 'Beach Pier, Miami',
        image: 'https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=800&auto=format'
    }
];

const seedItems = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding items...');

        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('Admin user not found. Please run seed.js first.');
            process.exit(1);
        }

        await Item.deleteMany({});
        
        const itemsToSeed = items.map(item => ({
            ...item,
            poster: admin._id
        }));

        await Item.insertMany(itemsToSeed);
        console.log('✅ 6 Mock Items seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding items:', error);
        process.exit(1);
    }
};

seedItems();

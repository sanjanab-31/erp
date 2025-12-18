import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const clearDatabase = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log(`\n📊 Found ${collections.length} collections\n`);

        for (const collection of collections) {
            const collectionName = collection.name;
            const count = await db.collection(collectionName).countDocuments();
            
            console.log(`🗑️  Clearing ${collectionName} (${count} documents)...`);
            await db.collection(collectionName).deleteMany({});
            console.log(`✅ Cleared ${collectionName}`);
        }

        console.log('\n✨ All collections cleared successfully!\n');
        
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
};

clearDatabase();

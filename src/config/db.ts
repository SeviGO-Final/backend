import mongoose from 'mongoose';
import User from "../models/User";
import bcrypt from "bcryptjs";
import {getEnv} from "../utils/getenv";
class DatabaseConfig {
  connectToDatabase = async (): Promise<void> => {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is undefined. Check for mongo_URI');
      }
      await mongoose.connect(process.env.MONGO_URI, {});
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('Connection error: ', error);
    }
  };

  adminSeeder = async () => {
    const adminEmail = getEnv('ADMIN_EMAIL');
    const adminPassword = getEnv('ADMIN_PASSWORD');

    try {
      const existingAdmin = await User.findOne({email: adminEmail});
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Buat user admin baru
        const adminUser = new User({
          nik: '1234567890564387',
          name: 'Admin Old',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
          is_verified: true,
        });

        await adminUser.save();
        console.log("Admin user created successfully");
      } else {
        console.log("Admin user already exists");
      }
    } catch (error) {
      console.error("Error creating admin user:", error);
    }
  }
}
export default new DatabaseConfig();

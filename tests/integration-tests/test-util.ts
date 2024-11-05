import User from "../../src/models/User";
// @ts-ignore
import bcrypt from "bcryptjs";

export class TestUtil {
    static async deleteUsers() {
        try {
            const result = await User.deleteMany({});
            console.log(`${result.deletedCount} users has been deleted`);
        } catch (e) {
            console.error('Error deleting users:', e.message);
        }
    }

    static async createUser() {
        try {
            const newUser = new User({
                nik: "1267386729476297",
                name: "test",
                email: "test@test.com",
                password: await bcrypt.hash("123", 10),
                is_verified: true
            });

            await newUser.save();
            console.log('User successfully created');

            return newUser;
        } catch (e) {
            console.error('Error creating user:', e.message);
        }
    }
}
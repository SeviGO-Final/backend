import { Request, Response } from 'express';
import { register as registerUser, login as loginUser } from '../services/authServices';

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, nik }: { name: string; email: string; password: string; nik: string } = req.body;

        // Check if all required fields are present
        if (!name || !email || !password || !nik) {
            res.status(400).json({ message: 'Name, email, password, and NIK are required' });
            return;
        }

        await registerUser(name, email, password, nik); // Memanggil fungsi service
        res.status(201).json({ message: 'User registered, pending admin verification' });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password }: { email: string; password: string } = req.body;

        const token = await loginUser(email, password); // Memanggil fungsi service
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export { register, login };

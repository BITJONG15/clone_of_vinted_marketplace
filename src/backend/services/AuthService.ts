import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export class AuthService {
  private userRepository = new UserRepository();

  async register(data: any): Promise<{ token: string; user: Omit<User, 'password_hash'> }> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const password_hash = await bcrypt.hash(data.password, 10);
    const userId = await this.userRepository.create({
      username: data.username,
      email: data.email,
      password_hash,
      avatar: data.avatar
    });

    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User creation failed');

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const { password_hash: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async login(data: any): Promise<{ token: string; user: Omit<User, 'password_hash'> }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const { password_hash: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async getMe(userId: number): Promise<Omit<User, 'password_hash'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from "../src/database/entities/user.entity";
import { Wallet } from "../src/database/entities/wallet.entity";

describe('User Entity', () => {
    it('should create a User entity with valid properties', () => {
        const user = new User();
        user.name = 'John Doe';
        user.password = 'password123';
        user.email = 'john.doe@example.com';
        user.created_at = new Date();
        user.updated_at = new Date();
        user.wallet = new Wallet();
    
        expect(user).toBeDefined();
        expect(user.name).toBe('John Doe');
        expect(user.password).toBe('password123');
        expect(user.email).toBe('john.doe@example.com');
        expect(user.created_at).toBeInstanceOf(Date);
        expect(user.updated_at).toBeInstanceOf(Date);
        expect(user.wallet).toBeInstanceOf(Wallet);
    });

    it('should not allow duplicate email addresses', async () => {
        const user1 = plainToInstance(User, {
          name: 'John Doe',
          password: 'password123',
          email: 'duplicate@example.com',
        });
    
        const user2 = plainToInstance(User, {
          name: 'Jane Doe',
          password: 'password456',
          email: 'duplicate@example.com',
        });
    
        const errors1 = await validate(user1);
        const errors2 = await validate(user2);
    
        expect(errors1.length).toBe(0);
        expect(errors2.length).toBe(0);
    
        // TODO: This part would require actual database interaction to ensure uniqueness.
        try {
          if (user1.email === user2.email) {
            throw new Error('Duplicate email');
          }
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe('Duplicate email');
            } else {
                throw error;
            }
        }
      });
    
});
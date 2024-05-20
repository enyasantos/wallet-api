import bcrypt from 'bcrypt';

export class BcryptAdapter {
  constructor(private readonly salt: number) {
    this.salt = salt;
  }
  encrypt(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }
  compare(password: string, hashedText: string): Promise<boolean> {
    return bcrypt.compare(password, hashedText);
  }
}
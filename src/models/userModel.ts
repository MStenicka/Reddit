import db from '../database';
import { User } from '../interfaces/userInterface';

class UserModel {
  static create(user: User): Promise<{
    success: boolean;
    message: string;
    userId?: number;
    username?: string;
    email: string;
  }> {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users SET ?';
      db.query(query, user, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            success: true,
            message: 'The user was successfully created.',
            userId: result.insertId,
            username: user.username,
            email: user.email,
          });
        }
      });
    });
  }

  static findUserByUsername(username: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE username = ?';
      db.query(query, [username], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null);
          } else {
            resolve(results[0]);
          }
        }
      });
    });
  }

  static findUserByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      db.query(query, [email], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null);
          } else {
            resolve(results[0]);
          }
        }
      });
    });
  }
}

export default UserModel;

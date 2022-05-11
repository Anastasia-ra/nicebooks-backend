import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { createSerializedRegisterSessionTokenCookie } from './cookies';
import { createSession, createUser } from './database';
import { User } from './types';

export async function createUserWithHash(
  username: string,
  email: string,
  password: string,
) {
  if (typeof username !== 'string' || !username) {
    return ['Please provide a name'];
  }
  if (typeof email !== 'string' || !email) {
    return ['Please provide a valid email address'];
  }
  if (typeof password !== 'string' || !password) {
    return ['Please provide a password'];
  }

  try {
    const pwhash = await bcrypt.hash(password, 12);
    const user: User = await createUser(username, email, pwhash);

    const token = crypto.randomBytes(64).toString('base64');
    await createSession(token, user.id);
    // 3. serialize the cookie
    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      token,
    );
    return [null, serializedCookie, user];
  } catch (err) {
    return ['Problem creating the user'];
  }
}

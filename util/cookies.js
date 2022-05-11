import { serialize } from 'cookie';
import Cookies from 'js-cookie';

export function getParsedCookie(key) {
  const cookieValue = Cookies.get(key); // Type is string | undefined

  // Narrowing
  if (!cookieValue) {
    return undefined;
  }

  try {
    return JSON.parse(cookieValue); // Type is string
  } catch (err) {
    return undefined;
  }
}

export function createSerializedRegisterSessionTokenCookie(token) {
  // check if we are in production e.g. Heroku
  const isProduction = process.env.NODE_ENV === 'production';

  const maxAge = 60 * 10; // 10 minutes

  return serialize('sessionToken', token, {
    maxAge: maxAge,

    expires: new Date(Date.now() + maxAge * 1000),

    // Important for security
    httpOnly: true,
    // Set secure cookies on production (Heroku)
    secure: isProduction,
    path: '/',
    // Be explicit about new default behavior in browsers
    sameSite: 'lax',
  });
}

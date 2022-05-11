import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku.js';
import { User } from './types';

setPostgresDefaultsOnHeroku();
config();

declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    sql = postgres();

    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852

    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }
  return sql;
}

const sql = connectOneTimeToDatabase();

export async function deleteExpiredSessions() {
  const sessions = await sql`
  DELETE FROM
    sessions
  WHERE
    expiry < NOW()
  RETURNING
    *
  `;
  return sessions.map((session) => camelcaseKeys(session));
}

export async function createSession(token: string, userId: number) {
  const session = await sql`
  INSERT INTO sessions
    (token, user_id)
  VALUES
    (${token}, ${userId})
  RETURNING
    id,
    token,
    user_id
  `;
  await deleteExpiredSessions();
  return camelcaseKeys(session[0]);
}

export async function createUser(
  email: string,
  username: string,
  passwordHash: string,
) {
  const [user] = await sql<[User]>`
    INSERT INTO users
      (email, username, password_hash)
    VALUES
       (${email}, ${username}, ${passwordHash})
    RETURNING
       id,
       email,
       username
  `;
  return camelcaseKeys(user);
}

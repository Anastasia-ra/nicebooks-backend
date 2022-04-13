exports.up = async (sql) => {
  await sql`
  CREATE TABLE books (
		id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
		title varchar(90) UNIQUE NOT NULL,
		author varchar(90) UNIQUE NOT NULL,
		creationDate timestamp NOT NULL DEFAULT NOW(),
		user_id integer REFERENCES users (id) ON DELETE CASCADE,
		summary text,
		category_id integer REFERENCES categories (id) ON DELETE CASCADE
	);
	`;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE books
  `;
};

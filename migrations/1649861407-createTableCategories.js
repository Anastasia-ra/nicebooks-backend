exports.up = async (sql) => {
  await sql`
  CREATE TABLE categories (
		id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
		name varchar(30) UNIQUE NOT NULL
	);
	`;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE categories
  `;
};

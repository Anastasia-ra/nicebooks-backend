const users = [
  {
    email: 'hello@books.at',
    username: 'LittlePotato',
    password_hash: '123',
  },
];

exports.up = async (sql) => {
  await sql`
	INSERT INTO users ${sql(users, 'email', 'username', 'password_hash')}
	`;
};

exports.down = async (sql) => {
  for (const user of users) {
    await sql`
			DELETE FROM
				users
			WHERE
				email = ${user.email} AND
				username = ${user.username} AND
				password_hash = ${user.password_hash}
		`;
  }
};

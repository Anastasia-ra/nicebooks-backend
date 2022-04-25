const categories = [{ name: 'Romance' }, { name: 'Magical Realism' }];

exports.up = async (sql) => {
  await sql`
	INSERT INTO categories ${sql(categories, 'name')}
	`;
};

exports.down = async (sql) => {
  for (const category of categories) {
    await sql`
			DELETE FROM
				categories
			WHERE
				name = ${category.name}
		`;
  }
};

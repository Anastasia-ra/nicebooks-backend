const books = [
  {
    title: 'One hundred years of solitude',
    author: 'Gabriel García Márquez',
    user_id: 1,
    summary:
      'The brilliant, bestselling, landmark novel that tells the story of the Buendia family, and chronicles the irreconcilable conflict between the desire for solitude and the need for love—in rich, imaginative prose that has come to define an entire genre known as "magical realism.',
    category_id: 2,
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    user_id: 1,
    summary:
      'The story of unfortunate lovers Cathy and Heathcliff who, despite a deep affection for one another, are forced by circumstance and prejudice to live their lives apart. Heathcliff and Cathy first meet as children when her father, Mr. Earnshaw brings the abandoned boy to live with them. When the old man dies several years later, Cathy s brother, Hindley, now the master of the estate, turns Heathcliff out, forcing him to live with the servants and working as a stable boy. The barrier of class comes between them, and she eventually marries a rich neighbor, Edgar Linton, at which point, Heathcliff disappears. He returns several years later, now a rich man, but little can be done.',
    category_id: 1,
  },
];

exports.up = async (sql) => {
  await sql`
	INSERT INTO books ${sql(
    books,
    'title',
    'author',
    'user_id',
    'summary',
    'category_id',
  )}
	`;
};

exports.down = async (sql) => {
  for (const book of books) {
    await sql`
			DELETE FROM
				books
			WHERE
				title = ${book.title} AND
				author = ${book.author} AND
				user_id = ${book.user_id} AND
				summary = ${book.summary} AND
				category_id = ${book.category_id}
		`;
  }
};

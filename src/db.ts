import sql from 'sql.js';

const db = new sql();

// Function to run a query
function runQuery(query: string): any[] {
  try {
    const result = db.run(query);
    const rows: any[] = [];
    while (result.step()) {
      rows.push(result.values);
    }
    return rows;
  } catch (error) {
    console.error('Error running query:', error);
    return [];
  }
}

// Initialize the database with some data
function initializeDb(): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    );
  `);
}

export { db, runQuery, initializeDb };

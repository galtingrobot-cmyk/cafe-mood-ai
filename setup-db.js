import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: 'db.ncuxvacovekxpvtnvrpm.supabase.co',
  port: 5432,
  user: 'postgres',
  password: '8Ballpoolpro',
  database: 'postgres',
});

async function setup() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL!");

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS menu_items (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text NOT NULL,
        description text,
        price integer NOT NULL,
        category text NOT NULL CHECK (category IN ('kopi', 'non-kopi', 'snack', 'dessert')),
        image text,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Enable read access for all users" ON menu_items;
      CREATE POLICY "Enable read access for all users" ON menu_items FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Enable insert access for all users" ON menu_items;
      CREATE POLICY "Enable insert access for all users" ON menu_items FOR INSERT WITH CHECK (true);
      
      DROP POLICY IF EXISTS "Enable update access for all users" ON menu_items;
      CREATE POLICY "Enable update access for all users" ON menu_items FOR UPDATE USING (true);
      
      DROP POLICY IF EXISTS "Enable delete access for all users" ON menu_items;
      CREATE POLICY "Enable delete access for all users" ON menu_items FOR DELETE USING (true);
    `;

    await client.query(createTableQuery);
    console.log("Table menu_items and policies created successfully.");

    // Check if table is empty
    const res = await client.query('SELECT count(*) FROM menu_items');
    if (parseInt(res.rows[0].count) === 0) {
      const insertQuery = `
        INSERT INTO menu_items (name, description, price, category) VALUES 
        ('Espresso', 'Shot espresso pekat dengan crema sempurna', 22000, 'kopi'),
        ('Cappuccino', 'Espresso dengan steamed milk dan foam lembut', 32000, 'kopi'),
        ('Matcha Latte', 'Matcha premium Jepang dengan susu hangat', 33000, 'non-kopi'),
        ('Croissant', 'Croissant butter renyah berlapis-lapis', 25000, 'snack')
      `;
      await client.query(insertQuery);
      console.log("Initial data inserted.");
    } else {
      console.log("Table already contains data, skipping insert.");
    }

  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    await client.end();
  }
}

setup();

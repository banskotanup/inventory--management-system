const { Client } = require("pg");
const SQL = `
    CREATE TYPE order_status AS ENUM('Pending', 'Completed');

    CREATE TABLE suppliers(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255) UNIQUE NOT NULL,
        contact_person VARCHAR (255),
        email VARCHAR (255) UNIQUE NOT NULL,
        phone VARCHAR (255),
        address VARCHAR (255),
        created_at DATE DEFAULT NOW()
    );

    INSERT INTO suppliers (name, contact_person, email, phone, address)
    VALUES ('Anup Enterprises', 'Anup Banskota', 'baskotanup@gmail.com', '9862773203', 'Ilam');

    CREATE TABLE categories(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        category_name VARCHAR (255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        created_at DATE DEFAULT NOW()
    );

    INSERT INTO categories (category_name, description)
    VALUES ('Sports', 'This is the section for sport category.');

    CREATE TABLE items(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255) UNIQUE NOT NULL,
        sku VARCHAR (255) UNIQUE NOT NULL,
        description VARCHAR (255),
        category_id INT,
        supplier_id INT,
        unit_price DECIMAL(10, 2) CHECK (unit_price > 0),
        qty_in_stock INT CHECK (qty_in_stock >= 0),
        created_at DATE DEFAULT NOW(),
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
    );

    INSERT INTO items (name, sku, description, category_id, supplier_id, unit_price, qty_in_stock)
    VALUES ('Cricket Bat', 'cb123', 'This is cricket bat.', 1, 1, 1000, 50);

    CREATE TABLE purchase_order(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        supplier_id INT,
        total_amount DECIMAL(10, 2),
        order_date DATE DEFAULT NOW(),
        status order_status NOT NULL DEFAULT 'Pending',
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
    );

    INSERT INTO purchase_order (supplier_id, total_amount, status)
    VALUES (1, 30000, 'Pending');

    CREATE TABLE purchase_order_items(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        po_id INT,
        item_id INT,
        qty INT,
        unit_price DECIMAL(10, 2),
        FOREIGN KEY (po_id) REFERENCES purchase_order(id) ON DELETE SET NULL,
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL
    );

    INSERT INTO purchase_order_items (po_id, item_id, qty, unit_price)
    VALUES (1, 1, 20, 1500);

    CREATE TABLE sales_order (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        customer_name VARCHAR (255) NOT NULL,
        total_amount DECIMAL(10, 2),
        order_date DATE DEFAULT NOW(),
        status order_status NOT NULL DEFAULT 'Pending'
    );

    INSERT INTO sales_order (customer_name, total_amount, status)
    VALUES ('Shristy Mishra', 20000, 'Pending');

    CREATE TABLE sales_order_items(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        so_id INT,
        item_id INT,
        qty INT,
        unit_price DECIMAL(10, 2),
        FOREIGN KEY (so_id) REFERENCES sales_order(id) ON DELETE SET NULL,
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL
    );

    INSERT INTO sales_order_items(so_id, item_id, qty, unit_price)
    VALUES (1, 1, 100, 2000);
`;

async function main() {
    console.log("seeding...");
    const client = new Client({
        host: "localhost",
        user: "sysadmin",
        database: "imsdb",
        password: "Stdy4drm",
        port: 5432,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("DONE...");
}

main();
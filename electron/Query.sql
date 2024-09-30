CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price INTEGER,
    currency INTEGER,
    categoryID INTEGER,
    active INTEGER DEFAULT 1,
    FOREIGN KEY (categoryID) REFERENCES Category(id)
);

CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATETIME,
    paymentMethod TEXT,
    currency INTEGER,
    dolarPrice FLOAT,
    total INTEGER
);

CREATE TABLE IF NOT EXISTS productSold (
    saleID INTEGER,
    productID INTEGER,
    FOREIGN KEY (saleID) REFERENCES sales(id),
    FOREIGN KEY (productID) REFERENCES products(id),
    PRIMARY KEY (saleID, productID)
);

CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

INSERT INTO category (name) VALUES ("elpepe`");
INSERT INTO category (name) VALUES ("elpepe");
// backend/src/DB/initialDB.ts

import runQuery from "./dal"

const createTables = async () => {
    let Q = `
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('Regular User', 'Admin') NOT NULL
        );
    `;
    await runQuery(Q);

    Q = `
        CREATE TABLE IF NOT EXISTS vacations (
            vacation_id INT AUTO_INCREMENT PRIMARY KEY,
            destination VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            image_filename VARCHAR(255) NOT NULL
        );
    `;
    await runQuery(Q);

    Q = `
        CREATE TABLE IF NOT EXISTS followers (
            user_id INT NOT NULL,
            vacation_id INT NOT NULL,
            PRIMARY KEY (user_id, vacation_id),
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (vacation_id) REFERENCES vacations(vacation_id)
        );
    `;
    await runQuery(Q);
};

const createSampleData = async () => {
    // Insert sample users
    // let Q = `
    //     INSERT INTO users (first_name, last_name, email, password, role) VALUES
    //     ('John', 'Doe', 'john@example.com', 'password123', 'Regular User'),
    //     ('Jane', 'Smith', 'jane@example.com', 'password456', 'Regular User'),
    //     ('Admin', 'User', 'admin@example.com', 'adminpass', 'Admin');
    // `;
    // await runQuery(Q);

    // Insert sample vacations
   let Q = `
    INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename) VALUES
    ('Paris', 'City of Love', '2023-06-01', '2023-06-07', 1200.00, 'paris.jpg'),
    ('Tokyo', 'Modern meets traditional', '2023-07-15', '2023-07-22', 1800.00, 'tokyo.jpg'),
    ('New York', 'The Big Apple', '2023-08-10', '2023-08-17', 1500.00, 'newyork.jpg'),
    ('Rome', 'Eternal City', '2023-09-05', '2023-09-12', 1300.00, 'rome.jpg'),
    ('Bali', 'Island Paradise', '2023-10-01', '2023-10-08', 1600.00, 'bali.jpg'),
    ('London', 'Royal Experience', '2023-11-15', '2023-11-22', 1400.00, 'london.jpg'),
    ('Sydney', 'Harbor City', '2023-12-10', '2023-12-17', 2000.00, 'sydney.jpg'),
    ('Barcelona', 'Gaudi''s Wonderland', '2024-01-05', '2024-01-12', 1350.00, 'barcelona.jpg'),
    ('Dubai', 'City of Gold', '2024-02-20', '2024-02-27', 2200.00, 'dubai.jpg'),
    ('Santorini', 'Greek Island Getaway', '2024-03-15', '2024-03-22', 1700.00, 'santorini.jpg'),
    ('Rio de Janeiro', 'Carnival City', '2024-04-10', '2024-04-17', 1900.00, 'rio.jpg'),
    ('Machu Picchu', 'Ancient Inca City', '2024-05-05', '2024-05-12', 2100.00, 'machupicchu.jpg')
`;
    await runQuery(Q);

    // Insert sample followers
    Q = `
        INSERT INTO followers (user_id, vacation_id) VALUES
        (1, 1), (1, 3), (1, 5),
        (2, 2), (2, 4), (2, 6);
    `;
    await runQuery(Q);
};

// create tables and add sample data
// createTables().then(() => {
//     console.log("Done creating tables");
//     createSampleData().then(() => {
//         console.log("Done adding sample data");
//     });
// });
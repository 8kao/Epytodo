CREATE DATABASE IF NOT EXISTS epytodo;
USE epytodo;

CREATE TABLE user (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE todo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT current_timestamp(),
    due_time DATETIME NOT NULL DEFAULT current_timestamp(),
    status ENUM('not started', 'todo', 'in progress', 'done') DEFAULT 'not started',
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

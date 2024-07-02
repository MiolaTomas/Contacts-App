CREATE DATABASE IF NOT EXISTS products;

CREATE TABLE Flavors(
    id_sabor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Inserting sample data into Flavors table
INSERT INTO Flavors (nombre) VALUES ('Vanilla');
INSERT INTO Flavors (nombre) VALUES ('Chocolate');
INSERT INTO Flavors (nombre) VALUES ('Strawberry');
INSERT INTO Flavors (nombre) VALUES ('Mint');
INSERT INTO Flavors (nombre) VALUES ('Coffee');
INSERT INTO Flavors (nombre) VALUES ('Strawberry');

-- Creazione del database 'ztldb'
CREATE DATABASE ztldb;

-- Connessione al database 'ztldb'
\c ztldb;

-- Creazione della tabella 'ztl'
CREATE TABLE IF NOT EXISTS ztl (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE
);

-- Creazione della tabella 'utente'
CREATE TABLE IF NOT EXISTS utenti (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    tokens FLOAT NOT NULL,
    ruolo VARCHAR(50) NOT NULL
);

-- Creazione della tabella 'veicolo'
CREATE TABLE IF NOT EXISTS veicoli (
    targa VARCHAR(10) PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    proprietario_id INT NOT NULL,
    FOREIGN KEY (proprietario_id) REFERENCES utenti(id) ON DELETE CASCADE
);

-- Creazione della tabella 'varchi'
CREATE TABLE IF NOT EXISTS varchi (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ztl_id INT NOT NULL,
    orario_apertura TIME NOT NULL,
    orario_chiusura TIME NOT NULL,
    FOREIGN KEY (ztl_id) REFERENCES ztl(id) ON DELETE CASCADE
);

-- Creazione della tabella 'transito'
CREATE TABLE IF NOT EXISTS transiti (
    id SERIAL PRIMARY KEY,
    targa_veicolo VARCHAR(10) NOT NULL,
    pedaggio TIMESTAMP NOT NULL,
    varco_id INT NOT NULL,
    ingresso_uscita VARCHAR(10) CHECK (ingresso_uscita IN ('Ingresso', 'Uscita')) NOT NULL,
    FOREIGN KEY (targa_veicolo) REFERENCES veicoli(targa) ON DELETE CASCADE,
    FOREIGN KEY (varco_id) REFERENCES varchi(id) ON DELETE CASCADE
);

-- Creazione della tabella 'multa'
CREATE TABLE IF NOT EXISTS multe (
    id SERIAL PRIMARY KEY,
    transito_id INT NOT NULL,
    importo DECIMAL(10, 2) NOT NULL,
    data_emissione DATE NOT NULL,
    targa_veicolo VARCHAR(10) NOT NULL,
    is_pagata BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (transito_id) REFERENCES transiti(id) ON DELETE CASCADE,
    FOREIGN KEY (targa_veicolo) REFERENCES veicoli(targa) ON DELETE CASCADE
);

-- Creazione della tabella 'whitelist'
CREATE TABLE IF NOT EXISTS whitelist (
    id SERIAL PRIMARY KEY,
    targa_veicolo VARCHAR(10) NOT NULL,
    inizio_validita DATE NOT NULL,
    fine_validita DATE NOT NULL,
    FOREIGN KEY (targa_veicolo) REFERENCES veicoli(targa) ON DELETE CASCADE
);

-- Inserimento dati nella tabella 'ztl'
INSERT INTO ztl (nome, is_active) VALUES
('ZTL Zona verde', FALSE),
('ZTL Roma', TRUE);

-- Inserimento dati nella tabella 'utente'
INSERT INTO utenti (nome, email, password, tokens, ruolo) VALUES
('Mario Rossi', 'mario.rossi@example.com', 'Password123*', 100.0, 'operatore'),
('Luigi Bianchi', 'luigi.bianchi@example.com', 'Passsword123*', 100.0, 'varco'),
('Anna Verdi', 'anna.verdi@example.com', 'Password123*', 100.0, 'automobilista');

-- Inserimento dati nella tabella 'veicolo'
INSERT INTO veicoli (targa, tipo, proprietario_id) VALUES
('AB123CD', 'Auto', 1),
('EF456GH', 'Moto', 2),
('IJ789KL', 'Camper', 3);

-- Inserimento dati nella tabella 'varco'
INSERT INTO varchi (nome, ztl_id, orario_apertura, orario_chiusura) VALUES
('Varco1', 1, '08:00:00', '20:00:00'),
('Varco2', 2, '09:00:00', '21:00:00');

-- Inserimento dati nella tabella 'transito'
INSERT INTO transiti (targa_veicolo, pedaggio, varco_id, ingresso_uscita) VALUES
('AB123CD', '2024-07-07 08:30:00', 1, 'Ingresso'),
('EF456GH', '2024-07-07 09:00:00', 2, 'Uscita'),
('IJ789KL', '2024-07-07 10:15:00', 1, 'Ingresso');

-- Inserimento dati nella tabella 'multa'
INSERT INTO multe (transito_id, importo, data_emissione, targa_veicolo, is_pagata) VALUES
(1, 100.00, '2024-07-07', 'AB123CD', FALSE),
(2, 50.00, '2024-07-07', 'EF456GH', TRUE),
(3, 50.00, '2024-07-07', 'IJ789KL', TRUE);

-- Inserimento dati nella tabella 'whitelist'
INSERT INTO whitelist (targa_veicolo, inizio_validita, fine_validita) VALUES
('AB123CD', '2024-07-01', '2024-12-31');

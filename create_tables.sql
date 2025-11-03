-- Script para criar as tabelas do Event Management System
-- Execute este script no SQL Server Management Studio
-- Conectado ao banco: event_management

USE event_management;
GO

-- Tabela de Usuários
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    firebase_uid VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NULL,
    photo_url TEXT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Índice para firebase_uid
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);

-- Tabela de Eventos
CREATE TABLE events (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('feira', 'evento', 'congresso', 'workshop')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(500) NULL,
    description TEXT NULL,
    created_by INT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_events_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Índices para events
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_start_date ON events(start_date);

-- Tabela de Convites
CREATE TABLE invites (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    qr_code VARCHAR(255) NOT NULL UNIQUE,
    qr_code_image TEXT NOT NULL,
    email_sent BIT NOT NULL DEFAULT 0,
    sent_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_invites_event_id FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Índices para invites
CREATE INDEX idx_invites_event_id ON invites(event_id);
CREATE INDEX idx_invites_qr_code ON invites(qr_code);
CREATE INDEX idx_invites_email_sent ON invites(email_sent);

-- Tabela de Presenças
CREATE TABLE attendances (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    invite_id INT NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    checked_in_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    checked_in_by INT NOT NULL,
    location VARCHAR(255) NULL,
    CONSTRAINT fk_attendances_event_id FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendances_invite_id FOREIGN KEY (invite_id) REFERENCES invites(id),
    CONSTRAINT fk_attendances_checked_in_by FOREIGN KEY (checked_in_by) REFERENCES users(id)
);

-- Índices para attendances
CREATE INDEX idx_attendances_event_id ON attendances(event_id);
CREATE INDEX idx_attendances_checked_in_at ON attendances(checked_in_at);

GO

PRINT 'Tabelas criadas com sucesso!';
PRINT 'Estrutura do banco:';
PRINT '  - users (usuários)';
PRINT '  - events (eventos)';
PRINT '  - invites (convites)';
PRINT '  - attendances (presenças)';

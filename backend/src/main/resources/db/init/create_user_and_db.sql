CREATE USER wallet_user WITH PASSWORD 'wallet_pass';

CREATE DATABASE wallet_db OWNER wallet_user;

GRANT ALL PRIVILEGES ON DATABASE wallet_db TO wallet_user;


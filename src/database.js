import pg from 'pg';

const { Pool } = pg;

const connection = new Pool({
    user: 'postgres',
    password: '1',
    host: 'localhost',
    port: 5432,
    database: process.env.NODE_ENV === 'test' ? 'tests' : 'mywallet' 
});

export default connection;

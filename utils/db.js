import mysql from 'mysql';

const con = mysql.createConnection({
    host:process.env.host,
    user:process.env.user,
    password:process.env.password,
    database: process.env.database
});

con.connect((err) => {
    if (err) {
        console.log('connection error');
    } else {
        console.log('connected');
    }
});

export default con;
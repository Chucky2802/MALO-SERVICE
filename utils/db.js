/* db.js */

import mysql from 'mysql';

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'malo-crud-app'
});

con.connect((err) => {
    if (err) {
        console.log('connection error');
    } else {
        console.log('connected');
    }
});

export default con;
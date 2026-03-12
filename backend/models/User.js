import db from '../config/db.js';
import bcrypt from 'bcryptjs';

class User {
    /*
    *Create a new user
    this creates a new user with a hashed password
    notice we are using paramerterized queries this prevents sql injections 

    A parameterized query (also known as a prepared statement) is an SQL statement that uses placeholders for data values, which are then supplied at execution time. This method is the most effective way to prevent SQL injection attacks because it ensures that the database treats user input strictly as data, not as executable code
     */
   static async create({email,password,name}){
    const hashedPasssword = await bcrypt.hash(password,10);

    const result = await db.query(
        `INSERT INTO  USER (email,password_hash,name)
        Values ($1, $2, $3)
        RETURNING id, email, name, created_at `,
        [email,hashedPasssword,name]
    ) ;

    return result.rows[0];
   }
}


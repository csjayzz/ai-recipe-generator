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

   
   /**
   * Find user by email
   */

   static async findByEmail(id){
    const result = await db.query(
       'SELECT * FROM users WHERE email = $1',
        [id]
    );

    return result.rows[0];
}


   /**
   * Find user by ID
   */

   static async findById(id){
    const result = await db.query(
       'SELECT id,email,name,created_at,updated_at FROM users WHERE id=$1',
        [id]
    );

    return result.rows[0];
   }
   
   /**
    * Update user
    * COALSCE only updated fields that are provided perfect for partial updates 
    */

   static async update(id,updates){
    const {name,email} = updates;
    const result = await db.query(
        `
        UPDATE users 
    SET name = COALSCE($1, name),
        email = COALSCE($2,email)
        WHERE id = $3
        RETURNING id, email,name,updated_at`,
        [name,email,id]
    );

    return result.rows[0];
   }

   //password management methods 

   /**
* Update password
*/
static async updatePassword(id, newPassword) {
const hashed_Password = await bcrypt.hash(newPassword, 10);
await db.query(
'UPDATE users SET password_hash = $1 WHERE id = $2',
[hashedPassword, id]
);
}
/**
* Verify password
*/
static async verifyPassword (plainPassword, hashedPassword) {
return await bcrypt.compare (plainPassword, hashed_Password);

}

}



//this model will handle each user's preferences for recipe generation, such as dietary restrictions, preferred cuisines, and ingredient exclusions.
import db from '../config/db.js';

class UserPreference {
/**
* Create or update user preferences

upsert method, which creates a new preference record or updates an existing one if the user ID already exists.
The data handled includes dietary restrictions, allergies, preferred cuisines, default servings, and measurement units.
It utilizes SQL commands to interact with a database table named user_preferences.
The function returns the updated or newly created user record from the database.
*/

/*
what we are doing here is that we are destructuring the preferences object to extract each preference value with a default fallback.just in case some preferences are not provided we will use default values to ensure the database always has valid data to work with.
*/
static async upsert (userId, preferences) {
const {
dietary_restrictions = [],
allergies = [],
preferred_cuisines = [],
default_servings = 4,
measurement_unit = 'metric'
} = preferences;

/*
using postgres sql on conflict clause which essentially turns it into an upsert operation if a record for an user already exists update it or insert a new one */
const result = await db.query(
`INSERT INTO user_preferences
(user_id, dietary_restrictions, allergies, preferred_cuisines, default_servings, measurement_unit)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (user_id)
DO UPDATE SET
dietary_restrictions = $2,
allergies = $3,
preferred_cuisines = $4,
default_servings = $5,
measurement_unit = $6
RETURNING *`,
[userId, dietary_restrictions, allergies, preferred_cuisines, default_servings, measurement_unit]
);
return result.rows[0];
}

/**
* Get user preferences by user ID
This function retrieves a user's preferences from the database based on their user ID. It executes a SQL query to select the relevant fields from the user_preferences table and returns the result.*/
static async findByUserId(userId) {
const result = await db.query(
'SELECT * FROM user_preferences WHERE user_id = $1',
[userId]
);
return result.rows[0] || null;
}

  /**
   * Delete user preferences by user ID
   */
    static async delete(userId){
        await db.query(
            'DELETE FROM user_preferences WHERE user_id = $1',
            [userId]
        );
    }
}


export default UserPreference;

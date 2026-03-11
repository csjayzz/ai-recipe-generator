BCrypt.js JS for hashing passwords securely before storing them. Coors allows our front end to communicate with the backend from a different origin. Envages environment variables securely. Express our web framework for building the REST API. JSON web token for creating and verifying JWT tokens for authentication. PG Postgress SQL client for NodeJS. This is the driver that lets us talk to our database. Now let's install Nodemon as a dev dependency. This will auto restart our server whenever we make changes. Super helpful during development. 

Config folder holds configuration files like database connection. Controllers for route handler functions the business logic for each endpoint. Middleware custom middleware like authentication checking. Models database models user recipe pantry item meal plan etc. routes, API route definitions, utils, utility functions like token generation


NodeJS's built-in crypto module to create a random secure string. Open a new terminal and run this command. This generates a 64 byt random string and converts it to hexadimal. Perfect for a JWT secret.

// node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"



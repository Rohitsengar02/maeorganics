// Test MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Testing MongoDB connection...');
console.log('URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  console.log('Database:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
  mongoose.disconnect();
  process.exit(0);
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:');
  console.error('Error:', err.message);
  console.error('Code:', err.code);
  console.error('\nPossible issues:');
  console.error('1. Check your MongoDB Atlas username and password');
  console.error('2. Verify the database user has proper permissions');
  console.error('3. Check if your IP address is whitelisted in MongoDB Atlas');
  console.error('4. If password has special characters, ensure they are URL-encoded');
  process.exit(1);
});

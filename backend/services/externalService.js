// External API Service - Fetches users from external public API
require('dotenv').config();

const EXTERNAL_URL = process.env.EXTERNAL_USERS_API || 'https://jsonplaceholder.typicode.com/users';

async function fetchExternalUsers() {
  const response = await fetch(EXTERNAL_URL);
  
  if (!response.ok) {
    throw new Error(`External API request failed with status ${response.status}`);
  }

  const data = await response.json();

  // Map response to simple clean format
  return data.map(u => ({
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    phone: u.phone,
    company: u.company?.name || 'N/A',
    city: u.address?.city || 'N/A',
    website: u.website || 'N/A'
  }));
}

module.exports = {
  fetchExternalUsers
};

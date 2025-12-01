const blacklist = new Set();

const addToBlacklist = (token, expiresAt) => {
  const timeUntilExpiry = expiresAt * 1000 - Date.now();
  if (timeUntilExpiry > 0) {
    blacklist.add(token);
    setTimeout(() => {
      blacklist.delete(token);
    }, timeUntilExpiry);
  }
};

// Cek apakah token sudah di blacklist
const isBlacklisted = (token) => {
  return blacklist.has(token);
};

module.exports = { addToBlacklist, isBlacklisted };

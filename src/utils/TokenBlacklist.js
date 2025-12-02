const blacklist = new Map();
const addToBlacklist = (token, expiresAt) => {
  const now = Math.floor(Date.now() / 1000);
  const ttlSeconds = expiresAt - now;

  if (ttlSeconds <= 0) return;

  blacklist.set(token, expiresAt);

  setTimeout(() => {
    blacklist.delete(token);
  }, ttlSeconds * 1000 + 10000);
};

const isBlacklisted = (token) => {
  const expiresAt = blacklist.get(token);
  if (!expiresAt) return false;

  const now = Math.floor(Date.now() / 1000);
  if (now >= expiresAt) {
    blacklist.delete(token);
    return false;
  }

  return true;
};

const cleanupExpired = () => {
  const now = Math.floor(Date.now() / 1000);
  for (const [token, exp] of blacklist.entries()) {
    if (now >= exp) {
      blacklist.delete(token);
    }
  }
};

setInterval(cleanupExpired, 60 * 60 * 1000);

module.exports = { addToBlacklist, isBlacklisted };

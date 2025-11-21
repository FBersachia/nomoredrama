type Jti = string;

const blacklist = new Map<Jti, number>(); // jti -> exp (seconds since epoch)

export function addTokenToBlacklist(jti: Jti, exp: number) {
  blacklist.set(jti, exp);
  pruneExpired();
}

export function isTokenBlacklisted(jti?: Jti) {
  if (!jti) return false;
  const exp = blacklist.get(jti);
  if (!exp) return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (exp < nowSeconds) {
    blacklist.delete(jti);
    return false;
  }
  return true;
}

function pruneExpired() {
  const nowSeconds = Math.floor(Date.now() / 1000);
  for (const [jti, exp] of blacklist.entries()) {
    if (exp < nowSeconds) {
      blacklist.delete(jti);
    }
  }
}

const KEY = "app_state";

function write(value, days = 7) {
  const exp = new Date(Date.now() + days * 86400000).toUTCString();
  const data = encodeURIComponent(JSON.stringify(value));

  document.cookie = `${KEY}=${data}; expires=${exp}; path=/; SameSite=Lax`;
}

function read() {
  const entry = document.cookie
    .split("; ")
    .find((item) => item.startsWith(KEY + "="));

  if (!entry) return null;

  try {
    return JSON.parse(decodeURIComponent(entry.split("=")[1]));
  } catch {
    return null;
  }
}

export { write, read };
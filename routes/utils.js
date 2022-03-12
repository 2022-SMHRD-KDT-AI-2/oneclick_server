module.exports = function tokenParse(token) {
  const base = token.split(".")[1];
  const payload = Buffer.from(base, "base64");
  const { email } = JSON.parse(payload.toString());
  return email;
};

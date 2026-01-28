const CLIENT_ID = import.meta.env.VITE_LINEAR_CLIENT_ID;
const REDIRECT_URI = "http://localhost:3000/linear/callback";
const SCOPE = "read,write";

const handleLinearAuth = () => {
  const authUrl = new URL("https://linear.app/oauth/authorize");
  authUrl.searchParams.set("client_id", CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", SCOPE);
  authUrl.searchParams.set("state", crypto.randomUUID());

  window.location.href = authUrl.toString();
};

const LinearAuth = () => {
  return (
    <>
      <button onClick={handleLinearAuth}>Connect to Linear</button>
    </>
  );
};

export default LinearAuth;

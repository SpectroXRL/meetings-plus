import "./App.css";

const CLIENT_ID = import.meta.env.VITE_LINEAR_CLIENT_ID;
const REDIRECT_URI = "http://localhost:3000/callback";
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

const handleSubmit = async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  await fetch("http://localhost:3000/transcript", {
    method: "POST",
    body: formData,
  });
};

function App() {
  return (
    <>
      <button onClick={handleLinearAuth}>Connect to Linear</button>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          id="txtfile"
          name="transcript"
          accept=".txt,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;

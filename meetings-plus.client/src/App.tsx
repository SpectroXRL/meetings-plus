import "./App.css";

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

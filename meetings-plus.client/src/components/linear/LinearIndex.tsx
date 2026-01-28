import { type FormEvent } from "react";

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);

  await fetch("http://localhost:3000/linear/transcript", {
    method: "POST",
    body: formData,
  });
};

const LinearIndex = () => {
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
};

export default LinearIndex;

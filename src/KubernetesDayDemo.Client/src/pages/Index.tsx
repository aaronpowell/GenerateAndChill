import { useState } from "react";
import { Spinner } from "../components/Spinner";
import { Prompt } from "../components/Prompt";
import { Result } from "../components/Result";

enum PageState {
  Prompt,
  Loading,
  Result,
}

export const Index = () => {
  const [pageState, setPageState] = useState(PageState.Prompt);
  const [lastPrompt, setLastPrompt] = useState("");
  const [detailedPrompt, setDetailedPrompt] = useState("");
  const [imageUri, setImageUri] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const prompt = formData.get("prompt");

    if (prompt) {
      await generateImage(prompt as string);
    }
  };

  const generateImage = async (prompt: string) => {
    setPageState(PageState.Loading);
    const res = await fetch("/api/generate/image", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setPageState(PageState.Result);
    setImageUri(data.imageUri);
    setDetailedPrompt(data.prompt);
    setLastPrompt(prompt);
  };

  return (
    <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 lg:mx-auto lg:max-w-6xl lg:rounded-lg lg:px-10 text-center">
      <div>
        <h1 className="text-8xl">It's time to relax!</h1>
        {pageState === PageState.Prompt && (
          <Prompt handleSubmit={handleSubmit} />
        )}
        {pageState === PageState.Loading && <Spinner />}
        {pageState === PageState.Result && (
          <Result
            imageUri={imageUri}
            lastPrompt={detailedPrompt}
            regenerate={() => generateImage(lastPrompt)}
            reset={() => {
              setPageState(PageState.Prompt);
              setImageUri("");
              setLastPrompt("");
              setDetailedPrompt("");
            }}
          />
        )}
      </div>
    </div>
  );
};

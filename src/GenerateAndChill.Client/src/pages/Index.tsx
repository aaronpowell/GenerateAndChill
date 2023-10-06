import React, { useEffect, useRef } from "react";
import {
  ActionFunction,
  Form,
  redirect,
  useNavigation,
} from "react-router-dom";
import { generateImage } from "../generate";
import { Spinner } from "../components/Spinner";
import { useSpeechRecognition } from "../useSpeechRecognition";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const [error, response] = await generateImage(
    formData.get("prompt") as string
  );

  if (error || !response) {
    return redirect("/naughty");
  }

  return redirect(`/${response.id}`);
};

export const Index = () => {
  const submitRef = useRef<HTMLButtonElement>(null);
  const navigation = useNavigation();
  const [input, setInput] = React.useState("");

  const { isListening, start, stop, transcript } = useSpeechRecognition();

  const checkSubmit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      if (submitRef.current) {
        submitRef.current.click();
      }
    }
  };

  const record = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  useEffect(() => {
    setInput(() => transcript);
  }, [transcript]);

  return (
    <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 lg:mx-auto lg:max-w-6xl lg:rounded-lg lg:px-10 text-center">
      <div>
        <h1 className="text-8xl">The machines are taking over!</h1>
        <section>
          <p>Given we now have a whole lot more time thanks to AI, what will you do with your new found free time?</p>
          {navigation.state === "submitting" && <Spinner />}
          {navigation.state !== "submitting" && (
            <Form action="" method="POST">
              <div className="flex flex-row justify-center items-center gap-4">
                <textarea
                  id="prompt"
                  name="prompt"
                  className="border-black border-2 rounded-md w-full h-32 p-2 mt-4"
                  onKeyDown={checkSubmit}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="I'll be sitting by the beach drinking a beer"
                ></textarea>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={record}
                  title="Record a prompt"
                >
                  <i className="fas fa-microphone"></i>
                </button>
              </div>
              <br />
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm"
                ref={submitRef}
              >
                Generate
              </button>
              &nbsp;
              <button
                type="reset"
                className="px-4 py-2 font-semibold text-sm bg-gray-200 text-gray-700 rounded-full shadow-sm"
                onClick={() => setInput("")}
              >
                Reset
              </button>
            </Form>
          )}
        </section>
      </div>
    </div>
  );
};

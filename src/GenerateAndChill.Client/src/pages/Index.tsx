import { useRef } from "react";
import {
  ActionFunction,
  Form,
  redirect,
  useNavigation,
} from "react-router-dom";
import { generateImage } from "../generate";
import { Spinner } from "../components/Spinner";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const response = await generateImage(formData.get("prompt") as string);

  return redirect(`/${response.id}`);
};

export const Index = () => {
  const submitRef = useRef<HTMLButtonElement>(null);
  const navigation = useNavigation();

  const checkSubmit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      if (submitRef.current) {
        submitRef.current.click();
      }
    }
  };

  return (
    <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 lg:mx-auto lg:max-w-6xl lg:rounded-lg lg:px-10 text-center">
      <div>
        <h1 className="text-8xl">It's time to relax!</h1>
        <section>
          <p>Thanks to DDD Perth, I've learnt a bunch of cool new things.</p>
          <p>
            Enter a prompt below and generate an image of what you'll do with
            all that free time!
          </p>
          {navigation.state === "submitting" && <Spinner />}
          {navigation.state !== "submitting" && (
            <Form action="" method="POST">
              <textarea
                id="prompt"
                name="prompt"
                className="border-black border-2 rounded-md w-full h-32 p-2 mt-4"
                onKeyDown={checkSubmit}
              ></textarea>
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

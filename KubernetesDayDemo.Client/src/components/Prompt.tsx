export type PromptProps = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const Prompt = ({ handleSubmit }: PromptProps) => {
  return (
    <section>
      <p>
        Thanks to VS Code and the Kubernetes extension, I have all the time in
        the world to write code.
      </p>
      <p>
        Enter a prompt below and generate an image of what you'll do with all
        that free time!
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          id="prompt"
          name="prompt"
          className="border-black border-2 rounded-md w-full h-32 p-2 mt-4"
        ></textarea>
        <br />
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm"
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
      </form>
    </section>
  );
};

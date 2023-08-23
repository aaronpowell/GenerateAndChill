export type ResultProps = {
  imageUri: string;
  lastPrompt: string;
  regenerate: () => void;
  reset: () => void;
};

export const Result = ({
  imageUri,
  lastPrompt,
  regenerate,
  reset,
}: ResultProps) => {
  return (
    <section className="h-screen">
      <img src={imageUri} alt={lastPrompt} className="mx-auto" />
      <p>Prompt</p>
      <pre className="text-left overflow-x-scroll">{lastPrompt}</pre>
      <button
        onClick={regenerate}
        className="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm"
      >
        Regenerate
      </button>
      &nbsp;
      <button
        onClick={reset}
        className="px-4 py-2 font-semibold text-sm bg-gray-200 text-gray-700 rounded-full shadow-sm"
      >
        Reset
      </button>
    </section>
  );
};

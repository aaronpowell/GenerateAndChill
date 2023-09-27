import { Form, NavLink } from "react-router-dom";
import { QRCode } from "./QRCode";

export type ResultProps = {
  imageUri: string;
  detailedPrompt: string;
  originalPrompt: string;
};

export const Result = ({
  imageUri,
  detailedPrompt,
  originalPrompt,
}: ResultProps) => {
  return (
    <section className="h-screen">
      <img src={imageUri} alt={detailedPrompt} className="mx-auto" />
      <p>Prompt</p>
      <pre className="text-left overflow-x-scroll">{detailedPrompt}</pre>
      <Form action="" method="POST">
        <input type="hidden" name="prompt" value={originalPrompt} />
        <button className="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm">
          Regenerate
        </button>
        &nbsp;
        <NavLink
          to="/"
          className="px-4 py-2 font-semibold text-sm bg-gray-200 text-gray-700 rounded-full shadow-sm"
        >
          Reset
        </NavLink>
      </Form>

      <QRCode />
    </section>
  );
};

import { Result } from "../components/Result";
import { LoaderFunction, redirect, useLoaderData } from "react-router-dom";
import { GeneratedImage, getImage } from "../generate";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.id) {
    return redirect("/");
  }

  const data = await getImage(params.id);

  return data;
};

export const ImagePage = () => {
  const data = useLoaderData() as GeneratedImage;

  return (
    <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 lg:mx-auto lg:max-w-6xl lg:rounded-lg lg:px-10 text-center">
      <div>
        <h1 className="text-8xl">It's time to relax!</h1>
        <Result
          imageUri={data.imageUri}
          detailedPrompt={data.detailedPrompt}
          originalPrompt={data.originalPrompt}
        />
      </div>
    </div>
  );
};

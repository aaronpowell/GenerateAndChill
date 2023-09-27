import { Result } from "../components/Result";
import {
  Await,
  LoaderFunction,
  defer,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { GeneratedImage, getImage } from "../generate";
import { Suspense } from "react";
import { Spinner } from "../components/Spinner";

export const loader: LoaderFunction = ({ params }) => {
  if (!params.id) {
    return redirect("/");
  }

  return defer({
    data: getImage(params.id),
  });
};

export const ImagePage = () => {
  const data = useLoaderData() as { data: GeneratedImage };

  return (
    <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 lg:mx-auto lg:max-w-6xl lg:rounded-lg lg:px-10 text-center">
      <div>
        <Suspense fallback={<Spinner />}>
          <Await resolve={data.data}>
            {(generatedImage) => {
              return (
                <>
                  <h1 className="text-8xl">It's time to relax!</h1>
                  <Result
                    imageUri={generatedImage.imageUri}
                    detailedPrompt={generatedImage.detailedPrompt}
                    originalPrompt={generatedImage.originalPrompt}
                  />
                </>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
};

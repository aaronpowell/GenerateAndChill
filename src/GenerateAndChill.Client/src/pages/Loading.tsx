import { Spinner } from "../components/Spinner";

export const LoadingPage = () => {
  return (
    <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 lg:mx-auto lg:max-w-6xl lg:rounded-lg lg:px-10 text-center">
      <div>
        <h1 className="text-8xl">Let's cook something up!</h1>
        <Spinner />
      </div>
    </div>
  );
};

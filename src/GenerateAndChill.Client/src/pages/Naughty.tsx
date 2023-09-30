import { Link } from "react-router-dom";

export const NaughtyPage = () => {
  return (
    <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 lg:mx-auto lg:max-w-6xl lg:rounded-lg lg:px-10 text-center">
      <div>
        <h1 className="text-8xl">You did something bad.</h1>
        <section>
          <img
            src="/images/jt.webp"
            alt="Justin Timberlake looking dissapointed"
            className="mx-auto"
          />
          <p>
            Well, you triggered our content filter, that wasn't very nice was
            it? Why don't you <Link to="/">return home</Link> and start again.
          </p>
        </section>
      </div>
    </div>
  );
};

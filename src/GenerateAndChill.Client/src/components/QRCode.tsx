import { toDataURL } from "qrcode";
import { Suspense } from "react";
import { Await } from "react-router-dom";

export const QRCode = () => {
  const dataUrl = toDataURL(location.href);

  return (
    <Suspense>
      <Await resolve={dataUrl}>
        {(dataUrl) => {
          return <img src={dataUrl} className="mx-auto" />;
        }}
      </Await>
    </Suspense>
  );
};

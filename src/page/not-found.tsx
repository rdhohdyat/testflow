import { Link } from "react-router-dom";
import erorr_404 from "../assets/404.svg";
import { Button } from "../components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-800">
          404 - Halaman Tidak Ditemukan
        </h1>
        <p className="mt-4 text-neutral-600">
          Maaf, halaman yang kamu cari tidak tersedia.
        </p>
        <img
          src={erorr_404}
          alt="Error 404 illustration"
          className="w-full max-w-md mx-auto drop-shadow-sm rounded-xl"
        />
        <Link to="/">
          <Button>Back to home</Button>
        </Link>
      </div>
    </div>
  );
}

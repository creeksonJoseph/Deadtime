import { Link } from "react-router-dom";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-[#34e0a1] flex flex-col items-center justify-center px-4 font-sans">
      <h1 className="text-5xl font-bold mb-4 text-center">DEADTIME</h1>
      <p className="text-lg max-w-xl mb-10 text-white text-center">
        Revive abandoned dreams. Browse, adopt, or resurrect coding projects,
        content ideas, and startups left in the graveyard.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link
          to="/signup"
          className="bg-[#34e0a1] text-black py-3 rounded-lg font-semibold text-center hover:bg-[#2cc185] transition"
        >
          Sign Up
        </Link>

        <Link
          to="/login"
          className="border border-[#34e0a1] text-[#34e0a1] py-3 rounded-lg font-semibold text-center hover:bg-[#34e0a122] hover:text-white transition"
        >
          Log In
        </Link>

        <button className="flex items-center justify-center gap-2 border border-white text-white py-3 rounded-lg hover:bg-white hover:text-black transition">
          <FaGithub />
          Continue with GitHub
        </button>

        <button className="flex items-center justify-center gap-2 border border-white text-white py-3 rounded-lg hover:bg-white hover:text-black transition">
          <FaGoogle />
          Continue with Google
        </button>

        <Link
          to="/graveyard"
          className="underline text-sm text-white text-center hover:text-[#2cc185]"
        >
          Browse without account →
        </Link>
      </div>
    </div>
  );
}

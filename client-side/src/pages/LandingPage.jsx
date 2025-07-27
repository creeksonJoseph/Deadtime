import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-[#34e0a1] font-sans tracking-wide">
      {/* Header */}
      <header className="p-6 flex justify-center border-b border-[#34e0a177] shadow-sm">
        <h1 className="text-4xl font-extrabold tracking-tight">DeadTime</h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-grow flex-col items-center justify-center px-4 text-center">
        <h2 className="text-4xl md:text-5xl mb-4 font-semibold">
          Start Your Journey
        </h2>
        <p className="mb-10 max-w-md text-[#34e0a199]">
          Join us and experience a seamless way to manage your account. Choose
          to log in, sign up, or continue with GitHub or Google.
        </p>

        <div className="space-y-4 w-full max-w-xs">
          {/* Auth Buttons */}
          <a
            href="/login"
            className="block w-full py-3 rounded bg-[#34e0a1] text-black font-semibold hover:bg-[#2cc185] shadow-lg transition"
          >
            Log In
          </a>
          <a
            href="/signup"
            className="block w-full py-3 rounded border-2 border-[#34e0a1] font-semibold hover:bg-[#34e0a144] transition"
          >
            Sign Up
          </a>

          {/* OR divider */}
          <div className="flex items-center gap-4 my-6 text-sm text-[#34e0a144]">
            <div className="h-px flex-grow bg-[#34e0a144]" />
            OR
            <div className="h-px flex-grow bg-[#34e0a144]" />
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 rounded border-2 border-[#34e0a1] hover:bg-[#34e0a144] transition"
              onClick={() => alert("GitHub OAuth not implemented")}
              aria-label="Continue with GitHub"
            >
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 0C5.372 0 0 5.373 0 12..." />
              </svg>
              Continue with GitHub
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 rounded border-2 border-[#34e0a1] hover:bg-[#34e0a144] transition"
              onClick={() => alert("Google OAuth not implemented")}
              aria-label="Continue with Google"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M533.5 278.4c0-17.2-1.5-33.8-4.4-49.9..."
                  fill="#34a853"
                />
                <path d="M272 544.3c72.6 0 133.4-24..." fill="#4285f4" />
                <path d="M120.8 328.5c-10.6-31.8-10.6-66.2..." fill="#fbbc04" />
                <path d="M272 107.7c39.3 0 74.5 13.5..." fill="#ea4335" />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-[#34e0a144] border-t border-[#34e0a177]">
        &copy; {new Date().getFullYear()} DeadTime. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;

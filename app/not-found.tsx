import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen max-h-screen w-full overflow-hidden bg-primaryColor flex items-start justify-center text-white px-4 py-8 relative">
      <div className="container relative text-center space-y-6 ">
        <h1
          className="text-[10rem] sm:text-[13rem] md:text-[27rem] font-semibold tracking-tighter bg-clip-text text-transparent z-20 drop-shadow-2xl"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, #00FFEA 0%, rgba(4 183 174 / 0.96) 25%, rgba(4 183 183 / 0.81) 50%, rgba(4 183 174 / 0.31) 68%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          404
        </h1>
        <div className="space-y-6 absolute top-[60%] md:top-[67%] left-1/2 -translate-x-1/2 w-full  flex flex-col items-center justify-center">
          <h2 className="text-2xl max-w-233 mx-auto sm:text-3xl md:text-6xl relative lg:text-7xl z-20  font-semibold text-white leading-[120%]">
            The page you are looking for doesn&apos;t exist
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#E5E6E8] ">
            Try to use a correct url or go back to homepage to start again
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="text-primaryColor px-6 py-2 md:py-3 rounded-full bg-whiteColor font-medium"
            >
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

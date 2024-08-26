export default function Custom404() {
    return <div className="min-h-screen bg-black h-full w-full flex flex-col gap-6 items-center justify-center text-white">
      <p className="font-bold text-3xl text-center tracking-wide">PAGE UNAVAILABLE</p>
      <a href="/" className="bg-blue-500 py-2 px-4 sm:px-8 rounded-md hover:bg-blue-700 font-semibold">GET BACK TO HOME</a>
    </div>
  }
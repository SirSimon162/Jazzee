import CustomCursor from "./components/cursor/CustomCursor";
import CTA from "./components/buttons/CTA";

function Home() {
  return (
    <>
      <CustomCursor />
      <div className="text-white min-h-screen inset-0 -z-10 h-full w-full flex flex-col justify-center items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] p-2">
        <p className="text-center font-bold text-2xl sm:text-6xl max-w-5xl">
          Unlock Unbeatable Deals on Enterprise SaaS Solutions
        </p>
        <p className="text-center font-medium text-md sm:text-xl mb-3 mt-2 sm:mb-8 sm:mt-4">
          Compare, Negotiate, and Save Big on the Software That Powers Your
          Business.
        </p>
        <CTA />
      </div>
    </>
  );
}

export default Home;

import CustomCursor from "./components/cursor/CustomCursor";
import CTA from "./components/buttons/CTA";
import FAQ from "./components/faq/FAQ";
import Works from "./components/works/Works";

function Home() {
  return (
    <div className="bg-black w-full text-white">
      <CustomCursor />
      <div className="w-full h-full bg-indigo-100">
        <div className="text-white min-h-screen inset-0 -z-10 h-full w-full flex flex-col justify-center items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] p-2 rounded-b-[20px] md:rounded-b-[100px]">
          <p className="text-center font-bold text-2xl sm:text-6xl max-w-5xl">
            Unlock Unbeatable Deals on Enterprise SaaS Solutions
          </p>
          <p className="text-center font-medium text-md sm:text-xl mb-3 mt-2 sm:mb-8 sm:mt-4">
            Compare, Negotiate, and Save Big on the Software That Powers Your
            Business.
          </p>
          <CTA />
        </div>
      </div>
      <Works />
      <FAQ />
    </div>
  );
}

export default Home;

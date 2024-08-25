import React from "react";

function Footer() {
  return (
    <div
      className="flex flex-col md:flex-row w-full justify-around items-center border-t-1 border-t-gray-800 border-t py-20 gap-5 [background:radial-gradient(225%_225%_at_10%_10%,#000_20%,#63e_110%)]"
      id="Contact"
    >
      <div className="flex flex-col items-center sm:items-start">
        <a
          className="font-RobotoMono text-3xl sm:text-5xl text-white flex justify-center items-center gap-2"
          href="/"
        >
          <p>Jazzee</p>
        </a>
      </div>
      <div className="flex flex-col items-center sm:items-start text-gray-200 font-RobotoMono">
        <a href="/tnc" target="__blank">
          Terms and Conditions
        </a>
        <a href="/privacy" target="__blank">
          Privacy Policy
        </a>
      </div>
    </div>
  );
}

export default Footer;

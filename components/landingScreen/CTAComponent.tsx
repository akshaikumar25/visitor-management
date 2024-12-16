import React from "react";

const CTAComponent = () => {
  return (
    <section className="bg-theme rounded-lg py-8 md:py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-2xl md:text-4xl font-bold text-black text-center md:text-left mb-4 md:mb-0">
          LET&apos;S GET YOUR PROJECT STARTED!
        </h2>
        <button className="bg-black text-white px-6 py-3 rounded mt-4 md:mt-0">
          CONTACT WITH US
        </button>
      </div>
    </section>
  );
};

export default CTAComponent;

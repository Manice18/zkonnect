import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, MoveRight } from "lucide-react";

const page = () => {
  return (
    <section className="flex h-screen flex-col items-center pt-48">
      <div className="flex min-h-[400px] min-w-[800px] flex-col items-center space-y-8">
        <h1 className="text-center text-3xl font-bold text-black">
          Tell Us About Yourself to Begin
        </h1>
        <form className="flex flex-col space-y-4 p-4">
          <div className="flex flex-col">
            <label htmlFor="input1" className="mb-2 font-medium text-black">
              Creator’s Name
            </label>
            <input
              type="text"
              id="input1"
              placeholder="Josh Gupta"
              className="h-[60px] w-[800px] rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="input2" className="mb-2 font-medium text-black">
              Domain of the Event
            </label>
            <input
              type="text"
              id="input2"
              placeholder="Singing"
              className="h-[60px] w-[800px] rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="input3" className="mb-2 font-medium text-gray-700">
              Expected number of events to host yearly
            </label>
            <input
              type="text"
              id="input3"
              placeholder="50"
              className="h-[60px] w-[357px] rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button className="space-x-9 self-end px-7 py-5 text-sm">
            <span>Continue</span>
            <MoveRight size={20} />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default page;

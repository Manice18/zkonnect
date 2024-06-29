"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Page: React.FC = () => {
  const [creatorName, setCreatorName] = useState("");
  const [domainOfExpertise, setDomainOfExpertise] = useState("");
  const [eventsInaYear, setEventsInaYear] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const newCreator = await prisma.creator.create({
        data: {
          creatorName,
          domainOfExpertise,
          eventsInaYear: parseInt(eventsInaYear, 10),
          walletAddress: "",
          noOfFollowers: 0,
        },
      });
      setResponseMessage("Creator added successfully!");
    } catch (error) {
      console.error(error);
      setResponseMessage("Error adding creator.");
    }
  };

  return (
    <section className="flex h-screen flex-col items-center pt-48">
      <div className="flex min-h-[400px] min-w-[800px] flex-col items-center space-y-8">
        <h1 className="text-center text-3xl font-bold text-black">
          Tell Us About Yourself to Begin
        </h1>
        <form className="flex flex-col space-y-4 p-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="input1" className="mb-2 font-medium text-black">
              Creator’s Name
            </label>
            <input
              type="text"
              id="input1"
              placeholder="Josh Gupta"
              className="h-[60px] w-[800px] rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              required
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
              value={domainOfExpertise}
              onChange={(e) => setDomainOfExpertise(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="input3" className="mb-2 font-medium text-gray-700">
              Expected number of events to host yearly
            </label>
            <input
              type="number"
              id="input3"
              placeholder="50"
              className="h-[60px] w-[357px] rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={eventsInaYear}
              onChange={(e) => setEventsInaYear(e.target.value)}
              required
            />
          </div>
          <Button
            className="space-x-9 self-end px-7 py-5 text-sm"
            type="submit"
          >
            <span>Continue</span>
            <MoveRight size={20} />
          </Button>
        </form>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </section>
  );
};

export default Page;

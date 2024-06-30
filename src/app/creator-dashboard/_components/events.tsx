"use client";

const Events = () => {
  return (
    <div className="col-span-1 rounded-md bg-white p-6 shadow-md md:col-span-2 md:col-start-6">
      <h3 className="mb-2 text-xl font-semibold">My Events</h3>
      <div className="mb-4 flex justify-between">
        <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-500 hover:bg-red-300 hover:text-red-500">
          Upcoming
        </button>
        <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-500 hover:bg-red-300 hover:text-red-500">
          Past
        </button>
        <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-500 hover:bg-red-300 hover:text-red-500">
          Drafts
        </button>
      </div>
      <div className="mb-3 rounded-md border p-4">
        <h4 className="mb-1 text-lg font-semibold">Event1</h4>
        <p className="text-gray-500">Desc</p>
        <p className="text-sm text-gray-400">Starts in 16h 32min</p>
      </div>
      <div className="mb-3 rounded-md border p-4">
        <h4 className="mb-1 text-lg font-semibold">Event1</h4>
        <p className="text-gray-500">Desc</p>
        <p className="text-sm text-gray-400">Starts in 16h 32min</p>
      </div>
      <div className="mb-3 rounded-md border p-4">
        <h4 className="mb-1 text-lg font-semibold">Event1</h4>
        <p className="text-gray-500">Desc</p>
        <p className="text-sm text-gray-400">Starts in 16h 32min</p>
      </div>
    </div>
  );
};

export default Events;

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const EventItem = ({ title, desc, startTime }) => (
//   <div className="mb-3 rounded-md border p-4 hover:bg-gray-100">
//     <h4 className="mb-1 text-lg font-semibold">{title}</h4>
//     <p className="text-gray-500">{desc}</p>
//     <p className="text-sm text-gray-400">{startTime}</p>
//   </div>
// );

const Events = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Events</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="upcoming"
              className="hover:bg-white hover:text-red-500"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="hover:bg-white hover:text-red-500"
            >
              Past
            </TabsTrigger>
            <TabsTrigger
              value="drafts"
              className="hover:bg-white hover:text-red-500"
            >
              Drafts
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="upcoming"
            className="mb-3 rounded-md border p-4 hover:bg-gray-100"
          >
            {/* <EventItem
              title="Event1"
              desc="Desc"
              startTime="Starts in 16h 32min"
            /> */}
            <h4 className="mb-1 text-lg font-semibold">Event1</h4>
            <p className="text-gray-500">Desc</p>
            <p className="text-sm text-gray-400">Starts in 16h 32min</p>
            {/* <EventItem
              title="Event1"
              desc="Desc"
              startTime="Starts in 16h 32min"
            />
            <EventItem
              title="Event1"
              desc="Desc"
              startTime="Starts in 16h 32min"
            /> */}
          </TabsContent>
          <TabsContent
            value="past"
            className="mb-3 rounded-md border p-4 hover:bg-gray-100"
          >
            <h4 className="mb-1 text-lg font-semibold">Event1</h4>
            <p className="text-gray-500">Desc</p>
            <p className="text-sm text-gray-400">Starts in 16h 32min</p>
          </TabsContent>
          <TabsContent
            value="drafts"
            className="mb-3 rounded-md border p-4 hover:bg-gray-100"
          >
            <h4 className="mb-1 text-lg font-semibold">Event1</h4>
            <p className="text-gray-500">Desc</p>
            <p className="text-sm text-gray-400">Starts in 16h 32min</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Events;

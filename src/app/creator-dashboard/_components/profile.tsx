import Image from "next/image";
import React from "react";
import { useEffect } from "react";
``;
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
} from "chart.js";

const Profile = () => {
  const chartRef = React.createRef();

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Revenue",
            data: [
              100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200,
            ],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "Revenue Chart",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }, []);

  return (
    <div>
      <div className="mt-4 grid grid-cols-6 gap-4 md:grid-cols-5">
        <div className="ms-6 mt-2 rounded-md bg-white p-6 shadow-md">
          <div className="mb-10 flex items-center justify-center">
            <Image
              src="/assets/profile-avatar.svg"
              width={60}
              height={60}
              alt="Michael Angelio"
              className="h-20 w-20 rounded-full"
            />
          </div>
          <h2 className="mb-2 text-center text-lg font-bold">
            Michael Angelio
          </h2>
          <p className="text-center text-gray-500">Singer</p>
        </div>
        <div className="ms-6 mt-2 w-[400px] rounded-md bg-white p-6 shadow-md">
          <h2 className="mb-4 font-bold">Create Event</h2>
          <div className="mb-5 flex items-center justify-center">
            <Image
              src="/assets/aicon.svg"
              width={60}
              height={60}
              alt="icon"
              className="h-28 w-28 rounded-full"
            />
          </div>
          <p className="text-center text-sm text-gray-500">
            Achieve Effortless Challenge Creation with AI
          </p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-md bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-semibold">Revenue</h3>
          <div className="h-48">
            <canvas href={chartRef} id="revenueChart"></canvas>
          </div>
          <div className="mt-4">
            <p className="font-semibold text-gray-500">Total</p>
            <p className="text-xl font-bold">$16,900</p>
            <p className="font-semibold text-gray-500">User</p>
            <p className="text-xl font-bold">40</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart() {
  const [userData, setUserData] = useState(null);
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      const POSTHOG_PERSONAL_API_KEY =
        "phx_E9UK0vOKUtyfJXjo2dlsSRKa4v6SqecCqxe6ioyWYn6";
      const endpointUrl = "https://app.posthog.com/api/event/";

      const headers = {
        Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}`,
      };

      try {
        const response = await axios.get(endpointUrl, { headers });
        const events = response.data.results;

        // Count the number of events per user
        const userEvents = {};
        events.forEach((event) => {
          const userId = event.distinct_id;
          if (!userEvents[userId]) {
            userEvents[userId] = 0;
          }
          userEvents[userId]++;
        });

        setEventData(events);
        setUserData(userEvents);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, []);

  // Prepare data for users, events, and event-user ratio
  const totalUsers = userData ? Object.keys(userData).length : 0;
  const totalEvents = eventData ? eventData.length : 0;
  const eventUserRatio = totalEvents !== 0 ? totalEvents / totalUsers : 0;

  const chartData = {
    labels: ["Users", "Events", "Event/User Ratio"],
    datasets: [
      {
        label: "Count",
        data: [totalUsers, totalEvents, eventUserRatio],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <TitleCard title={"User Events and Event/User Ratio"}>
      <Bar options={options} data={chartData} />
    </TitleCard>
  );
}

export default BarChart;

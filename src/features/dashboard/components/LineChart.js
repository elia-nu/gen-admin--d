import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function LineChart() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        fill: true,
        label: "MAU",
        data: [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  });

  useEffect(() => {
    const POSTHOG_PERSONAL_API_KEY =
      "phx_E9UK0vOKUtyfJXjo2dlsSRKa4v6SqecCqxe6ioyWYn6";
    const endpointUrl = "https://app.posthog.com/api/event/";
    const fetchData = async (url, mauData) => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}`,
          },
        });

        // Extracting relevant data from the response
        const newLabels = response.data.results.map(
          (result) => result.timestamp
        );
        const newMauData = response.data.results.map(
          (result) => result.person.distinct_ids.length
        );

        // Updating the chart's data state
        setData((prevData) => ({
          labels: [...prevData.labels, ...newLabels],
          datasets: [
            {
              ...prevData.datasets[0], // Keeping existing dataset properties
              data: [...prevData.datasets[0].data, ...newMauData],
            },
          ],
        }));

        // Check if there are more pages to fetch
        if (response.data.next) {
          // Fetch next page recursively
          await fetchData(response.data.next, [...mauData, ...newMauData]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Start fetching data from the initial endpoint
    fetchData(endpointUrl, []);
  }, []); // Fetch data only once on component mount

  return (
    <TitleCard title={"Montly Active Users "}>
      <Line data={data} options={options} />
    </TitleCard>
  );
}

export default LineChart;

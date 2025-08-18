import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import Swal from "sweetalert2";

const TopSideButtons = ({ applySearch }) => {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    applySearch(searchText);
  }, [searchText]);

  return (
    <div className="inline-block float-right">
      <SearchBar
        searchText={searchText}
        styleClass="mr-4"
        setSearchText={setSearchText}
      />
    </div>
  );
};

const Consultation = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/consultation`
      );
      setData(response.data);
      setOriginalData(response.data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const applySearch = (value) => {
    if (!value) {
      setData(originalData);
      return;
    }

    const filtered = originalData.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.companyName.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setData(filtered);
  };

  const deleteConsultation = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/consultation/${id}`
        );
        Swal.fire("Deleted!", "Consultation has been deleted.", "success");
        fetchData();
      } catch (error) {
        console.error("Error deleting consultation:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong!",
        });
      }
    }
  };

  const handleViewDetails = (consultation) => {
    Swal.fire({
      title: `<h3 class="text-xl font-bold mb-4">Consultation Details</h3>`,
      html: `
        <div class="text-left p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-1 gap-4">
            <div class="border-b pb-3">
              <p class="text-gray-600 text-sm">Client Information</p>
              <div class="mt-2 space-y-1">
                <p class="font-medium text-lg">${consultation.name}</p>
                <p class="text-gray-700">${consultation.companyName}</p>
              </div>
            </div>
            
            <div class="border-b pb-3">
              <p class="text-gray-600 text-sm">Contact Details</p>
              <div class="mt-2 space-y-1">
                <p class="font-medium">📧 ${consultation.email}</p>
                <p class="font-medium">📞 ${consultation.phoneNumber}</p>
              </div>
            </div>
            
            <div class="border-b pb-3">
              <p class="text-gray-600 text-sm">Preferred Schedule</p>
              <div class="mt-2 space-y-1">
                <p class="font-medium">📅 ${formatDate(
                  consultation.preferredDate
                )}</p>
                <p class="font-medium">🕐 ${consultation.preferredTime}</p>
              </div>
            </div>
            
            <div class="border-b pb-3">
              <p class="text-gray-600 text-sm">Description</p>
              <div class="mt-2 bg-white p-3 rounded-lg border border-gray-200">
                <p class="text-gray-800 leading-relaxed">${
                  consultation.description
                }</p>
              </div>
            </div>
            
            <div>
              <p class="text-gray-600 text-sm">Submission Date</p>
              <p class="font-medium text-sm text-gray-500 mt-1">${formatDate(
                consultation.createdAt
              )}</p>
            </div>
          </div>
        </div>
      `,
      width: "700px",
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: "rounded-xl shadow-2xl",
        content: "swal2-content-custom",
      },
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <TitleCard
        title="Consultation Management"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons applySearch={applySearch} />}
      >
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Preferred Date</th>
                <th>Preferred Time</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((consultation, index) => (
                <tr key={index}>
                  <td>{consultation.name}</td>
                  <td>{consultation.companyName}</td>
                  <td>{consultation.email}</td>
                  <td>{consultation.phoneNumber}</td>
                  <td>{formatDate(consultation.preferredDate)}</td>
                  <td>{consultation.preferredTime}</td>
                  <td>
                    <div
                      className="max-w-xs truncate"
                      title={consultation.description}
                    >
                      {consultation.description}
                    </div>
                  </td>
                  <td>{formatDate(consultation.createdAt)}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleViewDetails(consultation)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => deleteConsultation(consultation._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </div>
  );
};

export default Consultation;

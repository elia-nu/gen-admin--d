import React, { useState, useEffect } from "react";
import axios from "axios";
import InputText from "../../components/Input/InputText";
import ErrorText from "../../components/Typography/ErrorText";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";

import Swal from "sweetalert2";
const TopSideButtons = ({ handleShowForm, applySearch, setData, data }) => {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (searchText == "") {
      return;
    } else {
      applySearch(searchText);
    }
  }, [searchText]);

  return (
    <div className="inline-block float-right">
      <SearchBar
        searchText={searchText}
        styleClass="mr-4"
        setSearchText={setSearchText}
      />
      <button
        onClick={() => handleShowForm("", "add")}
        className="btn btn-primary mr-2 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        Add
      </button>
    </div>
  );
};
const Leads = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [formData, setFormData] = useState({
    videoLink: "",
  });
  const [showForm, setShowForm] = useState("hidden");

  const applySearch = (value) => {
    if (value === "") {
      // If search text is empty, reset data to original state
      setData(originalData);
    } else {
      // Filter data locally based on search text
      let filteredData = originalData.filter((item) => {
        for (let key in item) {
          if (
            typeof item[key] === "string" &&
            item[key].toLowerCase().includes(value.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });
      setData(filteredData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/video`
      );
      console.log("Data fetched successfully:", response.data);
      setData(response.data);
      setOriginalData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (value, updateType) => {
    setFormData({ ...formData, [updateType]: value });
  };

  const handleFileChange = (file, updateType) => {
    setFormData({ ...formData, [updateType]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showForm === "update") {
      handleUpdate(id);
      setId("");
      setFormData({
        videoLink: "",
      });
      setShowForm("hidden");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your Data has been Updated!",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("videoLink", formData.videoLink);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/video`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Data successfully submitted:", response.data);
      fetchData(); // Refresh data after submission
      setId("");
      setFormData({
        videoLink: "",
      });
      setShowForm("hidden");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your Data has been Added!",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("videoLink", formData.videoLink);

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/video/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Item updated successfully:", response.data);
      fetchData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDelete = async (id) => {
    const orginalData = data;

    Swal.fire({
      title: "Are you sure? You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/video/${id}`);
        console.log("Item deleted successfully");
        fetchData(); // Refresh data after deletion
      } else if (result.isDenied) {
        Swal.fire("opps!", "please try again!", "error");
        setData(orginalData);
      }
    });
  };
  const handleShowForm = (id, type) => {
    setShowForm(type);
    setId(id || "");
  };

  return (
    <div>
      {showForm === "add" && (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-4">
            <InputText
              labelTitle="Video Link:"
              labelStyle=""
              containerStyle=""
              defaultValue={formData.videoLink}
              placeholder=""
              updateFormValue={handleChange}
              updateType="videoLink"
            />
          </div>

          <div className="mb-4">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      )}
      {showForm === "update" && (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-4">
            <InputText
              labelTitle="Video Link:"
              labelStyle=""
              containerStyle=""
              defaultValue={formData.videoLink}
              placeholder=""
              updateFormValue={handleChange}
              updateType="videoLink"
            />
          </div>

          <div className="mb-4">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <TitleCard
          title="About Us"
          topMargin="mt-2"
          TopSideButtons={
            <TopSideButtons
              applySearch={applySearch}
              handleShowForm={handleShowForm}
              setData={setData}
              data={data}
            />
          }
        >
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Video Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((l, k) => {
                  return (
                    <tr key={k}>
                      <td>{k + 1}</td>
                      <td>{l.videoLink}</td>

                      <button
                        className="btn btn-primary mr-2"
                        onClick={() => handleShowForm(l._id, "update")}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(l._id)}
                      >
                        Delete
                      </button>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TitleCard>
      </div>
    </div>
  );
};

export default Leads;

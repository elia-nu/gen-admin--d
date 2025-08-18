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
const Calendar = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
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
        `${process.env.REACT_APP_BASE_URL}/api/career/`
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
      await handleUpdate(id);
      setId("");
      setFormData({
        title: "",
        description: "",
        image: null,
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
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("image", formData.image);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/career/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Data successfully submitted:", response.data);
      fetchData(); // Refresh data after submission
      setId("");
      setFormData({
        title: "",
        description: "",
        image: null,
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

      if (formData.title) {
        formDataToSend.append("title", formData.title);
      }
      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/career/${id}`,
        formDataToSend
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
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/career/${id}`
        );
        console.log("Item deleted successfully");
        await fetchData(); // Refresh data after deletion
        Swal.fire("Saved!", "", "success");
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
              labelTitle="Title:"
              labelStyle=""
              containerStyle=""
              defaultValue={formData.title}
              placeholder=""
              updateFormValue={handleChange}
              updateType="title"
            />
          </div>

          <div className="mb-4">
            <InputText
              labelTitle="Description:"
              labelStyle=""
              containerStyle=""
              defaultValue={formData.description}
              placeholder=""
              updateFormValue={handleChange}
              updateType="description"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="Image:"
              labelStyle=""
              containerStyle=""
              defaultValue=""
              placeholder=""
              type="file"
              updateFormValue={handleFileChange}
              updateType="image"
            />
          </div>
          <div className="flex gap-4">
            <div className="mb-4">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <div className="mb-4">
              <button
                onClick={() => setShowForm("hidden")}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
      {showForm === "update" && (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-4">
            <InputText
              labelTitle="Title:"
              labelStyle=""
              containerStyle=""
              defaultValue={formData.title}
              placeholder=""
              updateFormValue={handleChange}
              updateType="title"
            />
          </div>

          <div className="mb-4">
            <InputText
              labelTitle="Description:"
              labelStyle=""
              containerStyle=""
              defaultValue={formData.description}
              placeholder=""
              updateFormValue={handleChange}
              updateType="description"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="Image:"
              labelStyle=""
              containerStyle=""
              defaultValue=""
              placeholder=""
              type="file"
              updateFormValue={handleFileChange}
              updateType="image"
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
          title="In this space, you have the ability to add, search, update, and delete your Job Posts with ease."
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
          <div className="overflow-x-auto w-full flex flex-wrap justify-center">
            {data.map((l, k) => {
              return (
                <div
                  key={k}
                  className="card w-64 h-80 bg-base-100 shadow-xl m-2 flex flex-col"
                >
                  <figure className="flex-1">
                    <img
                      src={`${process.env.REACT_APP_BASE_URL}/${l.image}`}
                      alt="Shoes"
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div className="m-2 flex flex-col justify-between p-2">
                    <div>
                      <h2 className="card-title text-xs">{l.title}</h2>
                      <p className="text-xs">
                        {l.description.slice(0, 200)}...
                      </p>
                    </div>
                    <div className="card-actions flex justify-end">
                      <button
                        className="btn btn-primary text-xs mr-1"
                        onClick={() => handleShowForm(l._id, "update")}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger text-xs"
                        onClick={() => handleDelete(l._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TitleCard>
      </div>
    </div>
  );
};

export default Calendar;

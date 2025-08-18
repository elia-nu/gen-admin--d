import React, { useState, useEffect } from "react";
import axios from "axios";
import InputText from "../../components/Input/InputText";
import ErrorText from "../../components/Typography/ErrorText";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";

import Swal from "sweetalert2";
const TopSideButtons = ({ applySearch }) => {
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
    </div>
  );
};
const Info = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [formData, setFormData] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    companyProfile: "",
    howWeWork: "",
    whyChooseUs: "",
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
        `${process.env.REACT_APP_BASE_URL}/api/info`
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
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        companyProfile: "",
        howWeWork: "",
        whyChooseUs: "",
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
      formDataToSend.append("image1", formData.image1);
      formDataToSend.append("image2", formData.image2);
      formDataToSend.append("image3", formData.image3);
      formDataToSend.append("image4", formData.image4);
      formDataToSend.append("companyProfile", formData.companyProfile);
      formDataToSend.append("howWeWork", formData.howWeWork);
      formDataToSend.append("whyChooseUs", formData.whyChooseUs);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/info/`,
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
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        companyProfile: "",
        howWeWork: "",
        whyChooseUs: "",
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

      if (formData.image1) {
        formDataToSend.append("image1", formData.image1);
      }
      if (formData.image2) {
        formDataToSend.append("image2", formData.image2);
      }
      if (formData.image3) {
        formDataToSend.append("image3", formData.image3);
      }
      if (formData.image4) {
        formDataToSend.append("image4", formData.image4);
      }
      if (formData.companyProfile) {
        formDataToSend.append("companyProfile", formData.companyProfile);
      }
      if (formData.howWeWork) {
        formDataToSend.append("howWeWork", formData.howWeWork);
      }
      if (formData.whyChooseUs) {
        formDataToSend.append("whyChooseUs", formData.whyChooseUs);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/info/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/info/${id}`);
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
    setId(id);
    
    if (type === "update") {
      // Find the info data for the given id
      const infoToEdit = data.find(item => item._id === id);
      if (infoToEdit) {
        // Pre-fill the form with existing data
        setFormData({
          image1: null, // Keep null for file inputs
          image2: null,
          image3: null,
          image4: null,
          companyProfile: infoToEdit.companyProfile || "",
          howWeWork: infoToEdit.howWeWork || "",
          whyChooseUs: infoToEdit.whyChooseUs || ""
        });
      }
    }
  };

  return (
    <div>
      {showForm === "add" && (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-4">
            <InputText
              labelTitle="Image1:"
              labelStyle=""
              containerStyle=""
              defaultValue=""
              placeholder=""
              type="file"
              updateFormValue={handleFileChange}
              updateType="image1"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="Image2:"
              labelStyle=""
              containerStyle=""
              defaultValue=""
              placeholder=""
              type="file"
              updateFormValue={handleFileChange}
              updateType="image2"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="Image3:"
              labelStyle=""
              containerStyle=""
              defaultValue=""
              placeholder=""
              type="file"
              updateFormValue={handleFileChange}
              updateType="image3"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="Image4:"
              labelStyle=""
              containerStyle=""
              defaultValue=""
              placeholder=""
              type="file"
              updateFormValue={handleFileChange}
              updateType="image4"
            />
          </div>

          <div className="mb-4">
            <InputText
              labelTitle="Company Profile:"
              labelStyle=""
              containerStyle=""
              defaultValue={formData.companyProfile}
              placeholder=""
              updateFormValue={handleChange}
              updateType="companyProfile"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="How We Work:"
              labelStyle=""
              containerStyle=""
              defaultValue={formData.howWeWork}
              placeholder=""
              updateFormValue={handleChange}
              updateType="howWeWork"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="Why Choose Us:"
              labelStyle=""
              containerStyle=""
              defaultValue={formData.whyChooseUs}
              placeholder=""
              updateFormValue={handleChange}
              updateType="whyChooseUs"
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
              labelTitle="Image1:"
              labelStyle=""
              containerStyle=""
              defaultValue=""
              placeholder=""
              type="file"
              updateFormValue={handleFileChange}
              updateType="image1"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="Image2:"
              labelStyle=""
              containerStyle=""
              defaultValue=""
              placeholder=""
              type="file"
              updateFormValue={handleFileChange}
              updateType="image2"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="Image3:"
              labelStyle=""
              containerStyle=""
              defaultValue=""
              placeholder=""
              type="file"
              updateFormValue={handleFileChange}
              updateType="image3"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="Image4:"
              labelStyle=""
              containerStyle=""
              defaultValue=""
              placeholder=""
              type="file"
              updateFormValue={handleFileChange}
              updateType="image4"
            />
          </div>

          <div className="mb-4">
            <InputText
              labelTitle="Company Profile:"
              labelStyle=""
              containerStyle=""
              defaultValue={formData.companyProfile}
              placeholder=""
              updateFormValue={handleChange}
              updateType="companyProfile"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="How We Work:"
              labelStyle=""
              containerStyle=""
              defaultValue={formData.howWeWork}
              placeholder=""
              updateFormValue={handleChange}
              updateType="howWeWork"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="Why Choose Us:"
              labelStyle=""
              containerStyle=""
              defaultValue={formData.whyChooseUs}
              placeholder=""
              updateFormValue={handleChange}
              updateType="whyChooseUs"
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
          title="Contact Us"
          topMargin="mt-2"
          TopSideButtons={
            <TopSideButtons
              applySearch={applySearch}
            />
          }
        >
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Company Profile</th>
                  <th>Hero</th>
                  <th>Why Choose Us</th>
                  <th></th>
                  <th></th>
                  <th>Images</th>
                  <th></th>
                  <th></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((l, k) => {
                  return (
                    <tr key={k}>
                      <td>{k + 1}</td>

                      <td>{l.companyProfile.slice(0, 15)}...</td>
                      <td>{l.howWeWork.slice(0, 15)}...</td>
                      <td>{l.whyChooseUs.slice(0, 15)}...</td>
                      <td>
                        {" "}
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-circle w-12 h-12">
                              <img
                                src={`${process.env.REACT_APP_BASE_URL}/${l.image1}`}
                                alt="Avatar"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {" "}
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-circle w-12 h-12">
                              <img
                                src={`${process.env.REACT_APP_BASE_URL}/${l.image2}`}
                                alt="Avatar"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {" "}
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-circle w-12 h-12">
                              <img
                                src={`${process.env.REACT_APP_BASE_URL}/${l.image3}`}
                                alt="Avatar"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {" "}
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-circle w-12 h-12">
                              <img
                                src={`${process.env.REACT_APP_BASE_URL}/${l.image4}`}
                                alt="Avatar"
                              />
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleShowForm(l._id, "update")}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          Edit
                        </button>
                      </td>
                    
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

export default Info;

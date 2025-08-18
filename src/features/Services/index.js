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

const Services = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    subservice: []
  });
  const [showForm, setShowForm] = useState("hidden");
  const [subserviceCount, setSubserviceCount] = useState(1);
  const [expandedFeatures, setExpandedFeatures] = useState({});
  const [expandedServices, setExpandedServices] = useState({});

  const toggleFeatures = (serviceId, subserviceIndex) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [`${serviceId}-${subserviceIndex}`]: !prev[`${serviceId}-${subserviceIndex}`]
    }));
  };

  const toggleServiceDescription = (serviceId) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const applySearch = (value) => {
    if (value === "") {
      setData(originalData);
    } else {
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
        `${process.env.REACT_APP_BASE_URL}/api/service/`
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

  const handleSubserviceChange = (index, field, value) => {
    const updatedSubservices = [...formData.subservice];
    updatedSubservices[index] = {
      ...updatedSubservices[index],
      [field]: field === 'keyFeatures' ? value.split('\n') : value
    };
    setFormData({ ...formData, subservice: updatedSubservices });
  };

  const handleAddFeature = (index) => {
    const updatedSubservices = [...formData.subservice];
    const currentFeatures = updatedSubservices[index]?.keyFeatures || [];
    updatedSubservices[index] = {
      ...updatedSubservices[index],
      keyFeatures: [...currentFeatures, '']
    };
    setFormData({ ...formData, subservice: updatedSubservices });
  };

  const handleRemoveFeature = (subserviceIndex, featureIndex) => {
    const updatedSubservices = [...formData.subservice];
    const currentFeatures = [...updatedSubservices[subserviceIndex].keyFeatures];
    currentFeatures.splice(featureIndex, 1);
    updatedSubservices[subserviceIndex] = {
      ...updatedSubservices[subserviceIndex],
      keyFeatures: currentFeatures
    };
    setFormData({ ...formData, subservice: updatedSubservices });
  };

  const handleFeatureChange = (subserviceIndex, featureIndex, value) => {
    const updatedSubservices = [...formData.subservice];
    const currentFeatures = [...(updatedSubservices[subserviceIndex]?.keyFeatures || [])];
    currentFeatures[featureIndex] = value;
    updatedSubservices[subserviceIndex] = {
      ...updatedSubservices[subserviceIndex],
      keyFeatures: currentFeatures
    };
    setFormData({ ...formData, subservice: updatedSubservices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showForm === "update") {
      handleUpdate(id);
      setId("");
      setFormData({
        title: "",
        description: "",
        image: null,
        subservice: []
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
      formDataToSend.append("subservice", JSON.stringify(formData.subservice));

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/service/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Data successfully submitted:", response.data);
      fetchData();
      setId("");
      setFormData({
        title: "",
        description: "",
        image: null,
        subservice: []
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
      if (formData.subservice.length > 0) {
        formDataToSend.append("subservice", JSON.stringify(formData.subservice));
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/service/${id}`,
        formDataToSend
      );
      console.log("Item updated successfully:", response.data);
      fetchData();
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
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/service/${id}`
        );
        console.log("Item deleted successfully");
        fetchData();
      } else if (result.isDenied) {
        Swal.fire("opps!", "please try again!", "error");
        setData(orginalData);
      }
    });
  };

  const handleShowForm = (id, type) => {
    setShowForm(type);
    setId(id || "");
    if (type === "update") {
      const service = data.find(s => s._id === id);
      if (service) {
        setSubserviceCount(service.subservice?.length || 1);
        setFormData({
          title: service.title || "",
          description: service.description || "",
          image: null,
          subservice: service.subservice || []
        });
      }
    } else {
      setSubserviceCount(1);
      setFormData({
        title: "",
        description: "",
        image: null,
        subservice: []
      });
    }
  };

  const renderSubserviceForm = () => {
    return Array.from({ length: subserviceCount }).map((_, index) => (
      <div key={index} className="mb-6 p-4 border rounded bg-base-100 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg text-primary">Subservice {index + 1}</h3>
          <div className="space-x-2">
            {index === subserviceCount - 1 && (
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setSubserviceCount(prev => prev + 1)}
              >
                Add More Subservice
              </button>
            )}
            {subserviceCount > 1 && (
              <button
                type="button"
                className="btn btn-sm btn-error"
                onClick={() => {
                  const updatedSubservices = [...formData.subservice];
                  updatedSubservices.splice(index, 1);
                  setFormData({ ...formData, subservice: updatedSubservices });
                  setSubserviceCount(prev => prev - 1);
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <div className="mb-4">
          <InputText
            labelTitle="Title:"
            defaultValue={formData.subservice[index]?.title || ''}
            updateFormValue={(value) => handleSubserviceChange(index, 'title', value)}
            updateType={`subservice-${index}-title`}
          />
        </div>
        <div className="mb-4">
          <InputText
            labelTitle="Description:"
            defaultValue={formData.subservice[index]?.description || ''}
            updateFormValue={(value) => handleSubserviceChange(index, 'description', value)}
            updateType={`subservice-${index}-description`}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Key Features:</label>
          <div className="space-y-2">
            {(formData.subservice[index]?.keyFeatures || []).map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, featureIndex, e.target.value)}
                  placeholder={`Feature ${featureIndex + 1}`}
                />
                <button
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() => handleRemoveFeature(index, featureIndex)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline btn-primary btn-sm"
              onClick={() => handleAddFeature(index)}
            >
              Add Feature
            </button>
          </div>
        </div>
      </div>
    ));
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

          {renderSubserviceForm()}

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

          {renderSubserviceForm()}

          <div className="mb-4">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <TitleCard
          title="In this space, you have the ability to add, search, update, and delete your Services with ease."
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
            {data.map((service, k) => (
              <div
                key={k}
                className="card w-96 bg-base-100 shadow-xl m-4"
              >
                
                <div className="card-body">
                  <h2 className="card-title text-lg">{service.title}</h2>
                  <p className="text-sm mb-4">{service.description}</p>
                  
                  <div className="space-y-4">
                    {(expandedServices[service._id] ? service.subservice : service.subservice?.slice(0, 2))?.map((sub, i) => (
                      <div key={i} className="border-l-4 border-primary pl-4">
                        <h3 className="font-bold text-sm mb-1">{sub.title}</h3>
                        <p className="text-xs mb-2">{sub.description}</p>
                        <div className="text-xs">
                          {sub.keyFeatures && (
                            <>
                              <ul className="list-disc list-inside space-y-1">
                                {(expandedFeatures[`${service._id}-${i}`] 
                                  ? sub.keyFeatures 
                                  : sub.keyFeatures.slice(0, 2)
                                ).map((feature, fi) => (
                                  <li key={fi}>{feature}</li>
                                ))}
                              </ul>
                              {sub.keyFeatures.length > 2 && (
                                <button 
                                  onClick={() => toggleFeatures(service._id, i)}
                                  className="text-primary hover:text-primary-focus mt-1"
                                >
                                  {expandedFeatures[`${service._id}-${i}`] 
                                    ? 'Show Less' 
                                    : `+${sub.keyFeatures.length - 2} more features`}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    {service.subservice?.length > 2 && (
                      <button 
                        onClick={() => toggleServiceDescription(service._id)}
                        className="text-primary hover:text-primary-focus"
                      >
                        {expandedServices[service._id] 
                          ? 'Show Less' 
                          : `+${service.subservice.length - 2} more subservices`}
                      </button>
                    )}
                  </div>
                  
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleShowForm(service._id, "update")}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(service._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TitleCard>
      </div>
    </div>
  );
};

export default Services;

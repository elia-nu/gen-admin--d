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
      setData(data);
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
const Projects = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overview: "",
    image: null,
    benefits: []
  });
  const [showForm, setShowForm] = useState("hidden");
  const [selectedProject, setSelectedProject] = useState(null);

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
        `${process.env.REACT_APP_BASE_URL}/api/project/`
      );
      setData(response.data);
      setOriginalData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch projects'
      });
    }
  };

  const handleChange = (value, updateType) => {
    if (updateType === "benefits") {
      const benefitsArray = value.split('\n').filter(benefit => benefit.trim() !== '');
      setFormData({ ...formData, benefits: benefitsArray });
    } else {
      setFormData({ ...formData, [updateType]: value });
    }
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const addBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ""] });
  };

  const removeBenefit = (index) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({ ...formData, benefits: newBenefits });
  };

  const handleFileChange = (file, updateType) => {
    setFormData({ ...formData, [updateType]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showForm === "update") {
        await handleUpdate(id);
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("overview", formData.overview);
        formDataToSend.append("image", formData.image);
        formDataToSend.append("benefits", JSON.stringify(formData.benefits.filter(b => b.trim())));

        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/project/`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      fetchData();
      resetForm();
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Project ${showForm === "update" ? "Updated" : "Added"} Successfully!`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${showForm === "update" ? "update" : "add"} project`
      });
    }
  };

  const resetForm = () => {
    setId("");
    setFormData({
      title: "",
      description: "",
      overview: "",
      image: null,
      benefits: []
    });
    setShowForm("hidden");
    setSelectedProject(null);
  };

  const handleUpdate = async (id) => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          if (key === 'benefits') {
            formDataToSend.append(key, JSON.stringify(formData[key].filter(b => b.trim())));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/project/${id}`,
        formDataToSend
      );
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/project/${id}`
        );
        fetchData();
        Swal.fire("Deleted!", "Project has been deleted.", "success");
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to delete project.", "error");
    }
  };
  
  const handleShowForm = (id, type) => {
    setShowForm(type);
    setId(id || "");
    if (type === "update" && id) {
      const project = data.find(p => p._id === id);
      if (project) {
        setFormData({
          title: project.title || "",
          description: project.description || "",
          overview: project.overview || "",
          image: null,
          benefits: project.benefits || []
        });
      }
    } else if (type === "add") {
      setFormData({
        title: "",
        description: "",
        overview: "",
        image: null,
        benefits: []
      });
    }
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    Swal.fire({
      title: project.title,
      html: `
        <div class="text-left">
          <img src="${process.env.REACT_APP_BASE_URL}/${project.image}" class="w-full h-48 object-cover mb-4 rounded-lg shadow-lg">
          <div class="space-y-4">
            <div>
              <h3 class="text-xl font-bold text-primary mb-2">Overview</h3>
              <p class="text-gray-700">${project.overview}</p>
            </div>
            <div>
              <h3 class="text-xl font-bold text-primary mb-2">Description</h3>
              <p class="text-gray-700">${project.description}</p>
            </div>
            <div>
              <h3 class="text-xl font-bold text-primary mb-2">Benefits</h3>
              <ul class="space-y-2">
                ${project.benefits.map(benefit => `
                  <li class="flex items-start">
                    <span class="text-green-500 mr-2">✓</span>
                    <span class="text-gray-700">${benefit}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      `,
      width: '700px',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'swal2-popup-custom',
        content: 'swal2-content-custom'
      }
    });
  };

  const renderForm = (formType) => (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="space-y-4">
        <div>
          <InputText
            labelTitle="Title:"
            labelStyle="text-gray-700 font-semibold"
            containerStyle="border rounded p-2"
            defaultValue={formData.title}
            placeholder="Enter project title"
            updateFormValue={handleChange}
            updateType="title"
          />
        </div>
        <div>
          <InputText
            labelTitle="Overview:"
            labelStyle="text-gray-700 font-semibold"
            containerStyle="border rounded p-2"
            defaultValue={formData.overview}
            placeholder="Enter project overview"
            updateFormValue={handleChange}
            updateType="overview"
          />
        </div>
        <div>
          <InputText
            labelTitle="Description:"
            labelStyle="text-gray-700 font-semibold"
            containerStyle="border rounded p-2"
            defaultValue={formData.description}
            placeholder="Enter project description"
            updateFormValue={handleChange}
            updateType="description"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Benefits:</label>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleBenefitChange(index, e.target.value)}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder={`Benefit ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="p-2 text-red-500 hover:bg-red-100 rounded"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBenefit}
            className="w-full p-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
          >
            + Add Benefit
          </button>
        </div>

        <div>
          <InputText
            labelTitle="Image:"
            labelStyle="text-gray-700 font-semibold"
            containerStyle="border rounded p-2"
            defaultValue=""
            placeholder=""
            type="file"
            updateFormValue={handleFileChange}
            updateType="image"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 btn btn-primary">
            {formType === "update" ? "Update" : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm("hidden")}
            className="flex-1 btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div>
      {showForm === "add" && renderForm("add")}
      {showForm === "update" && renderForm("update")}

      {/* Table */}
      <div className="overflow-x-auto">
        <TitleCard
          title="In this space, you have the ability to add, search, update, and delete your Projects with ease."
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
            {data.map((project, index) => (
              <div
                key={index}
                className="card w-80 bg-white shadow-xl m-4 hover:shadow-2xl transition-shadow duration-200"
              >
                <figure className="h-48 relative group">
                  <img
                    src={`${process.env.REACT_APP_BASE_URL}/${project.image}`}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      className="btn btn-ghost text-white"
                      onClick={() => handleViewDetails(project)}
                    >
                      View Details
                    </button>
                  </div>
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title text-lg mb-2 text-primary">{project.title}</h2>
                  <p className="text-sm mb-2 line-clamp-2 text-gray-600">{project.description}</p>
                  <div className="mb-2">
                    <p className="text-sm font-semibold mb-1 text-gray-700">Key Benefits:</p>
                    <ul className="space-y-1">
                      {project.benefits.slice(0, 2).map((benefit, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="line-clamp-1">{benefit}</span>
                        </li>
                      ))}
                      {project.benefits.length > 2 && (
                        <li 
                          className="text-blue-500 cursor-pointer hover:text-blue-700 text-sm"
                          onClick={() => handleViewDetails(project)}
                        >
                          + {project.benefits.length - 2} more benefits...
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="card-actions justify-end mt-2 space-x-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleShowForm(project._id, "update")}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(project._id)}
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

export default Projects;

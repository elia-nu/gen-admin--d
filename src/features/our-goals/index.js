import React, { useState, useEffect } from "react";
import axios from "axios";
import InputText from "../../components/Input/InputText";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import Swal from "sweetalert2";

const TopSideButtons = ({ applySearch }) => {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (searchText !== "") {
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

const OurGoals = () => {
  const [goals, setGoals] = useState([]);
  const [originalGoals, setOriginalGoals] = useState([]);
  const [id, setId] = useState("");
  const [mainId, setMainId] = useState("");
  const [showForm, setShowForm] = useState("hidden");
  const [formData, setFormData] = useState({
    icons: null,
    title: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/our-goal`, {
        method: "GET"
      });

      const data = await response.json();
      const goalsData = data[0]?.goals || [];
      setMainId(data[0]?._id);
      setGoals(goalsData);
      setOriginalGoals(goalsData);

    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleChange = (value, updateType) => {
    setFormData({ ...formData, [updateType]: value });
  };

  const handleFileChange = (file, updateType) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setFormData({ ...formData, [updateType]: file });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Get all current goals
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/our-goal`);
      const currentGoals = response.data[0]?.goals || [];
      
      // Find the goal to update
      const goalIndex = currentGoals.findIndex(goal => goal._id === id);
      if (goalIndex === -1) {
        throw new Error("Goal not found");
      }

      // Update the goal in the array
      const updatedGoals = [...currentGoals];
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        title: formData.title || updatedGoals[goalIndex].title,
        description: formData.description || updatedGoals[goalIndex].description,
      };

      // If there's a new icon, append it
      if (formData.icons) {
        formDataToSend.append("outGoal_icon", formData.icons);
      }
      
      // Convert goals array to proper format
      const goalsToSend = updatedGoals.map(goal => ({
        _id: goal._id,
        icons: goal.icons,
        title: goal.title,
        description: goal.description
      }));

      formDataToSend.append("goals", JSON.stringify(goalsToSend));

      const requestOptions = {
        method: "PUT",
        body: formDataToSend,
        redirect: "follow"
      };

      await fetch(`${process.env.REACT_APP_BASE_URL}/api/our-goal/${mainId}`, requestOptions);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Goals have been updated!",
        showConfirmButton: false,
        timer: 1500,
      });

      setShowForm("hidden");
      setFormData({ icons: null, title: "", description: "" });
      setSelectedImage(null);
      fetchGoals();
    } catch (error) {
      console.error("Error updating goals:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error updating goals",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleShowForm = (goalId) => {
    setShowForm("update");
    setId(goalId);
    
    const goalToEdit = goals.find(goal => goal._id === goalId);
    if (goalToEdit) {
      setFormData({
        icons: null,
        title: goalToEdit.title || "",
        description: goalToEdit.description || "",
      });
      setSelectedImage(goalToEdit.icons ? `${process.env.REACT_APP_BASE_URL}/${goalToEdit.icons}` : null);
    }
  };

  const applySearch = (value) => {
    if (value === "") {
      setGoals(originalGoals);
    } else {
      const filteredGoals = originalGoals.filter((goal) =>
        goal.title.toLowerCase().includes(value.toLowerCase()) ||
        goal.description.toLowerCase().includes(value.toLowerCase())
      );
      setGoals(filteredGoals);
    }
  };

  return (
    <div>
      {showForm === "update" && (
        <form onSubmit={handleUpdate} className="max-w-lg mx-auto mb-8">
          <div className="mb-4">
            <InputText
              labelTitle="Icon:"
              type="file"
              updateFormValue={handleFileChange}
              updateType="icons"
              accept="image/*"
            />
            {selectedImage && (
              <div className="mt-2">
                <img 
                  src={selectedImage} 
                  alt="Selected Icon Preview" 
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
            )}
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="Title:"
              defaultValue={formData.title}
              updateFormValue={handleChange}
              updateType="title"
            />
          </div>
          <div className="mb-4">
            <InputText
              labelTitle="Description:"
              defaultValue={formData.description}
              updateFormValue={handleChange}
              updateType="description"
            />
          </div>
          <div className="mb-4">
            <button type="submit" className="btn btn-primary">
              Update Goal
            </button>
          </div>
        </form>
      )}

      <TitleCard
        title="Our Goals"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons applySearch={applySearch} />}
      >
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>No</th>
                <th>Icon</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal, index) => (
                <tr key={goal._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-circle w-12 h-12">
                        <img
                          src={goal.icons ? `${process.env.REACT_APP_BASE_URL}/${goal.icons}` : "https://placehold.co/100x100"}
                          alt="Goal Icon"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/100x100";
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>{goal.title}</td>
                  <td>{goal.description}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleShowForm(goal._id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Edit
                    </button>
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

export default OurGoals;
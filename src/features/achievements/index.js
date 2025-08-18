import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";
import Swal from "sweetalert2";
import InputText from "../../components/Input/InputText";

const TopSideButtons = ({ applySearch, handleShowForm }) => {
  return (
    <div className="inline-block float-right">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={() => handleShowForm(null, "add")}
      >
        Add New
      </button>
    </div>
  );
};

const Achievements = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [showForm, setShowForm] = useState("hidden");
  const [formData, setFormData] = useState({
    icons: null,
    title: "",
    number: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/achievement/`
      );
      setData(response.data);
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
    try {
      const formDataToSend = new FormData();
      
      // Create the achievement object
      const achievementData = {
        title: formData.title,
        number: formData.number
      };

      // Append the file with the correct field name 'achievement_icon'
      if (formData.icons) {
        formDataToSend.append('achievement_icon', formData.icons);
      }
      
      // Append the achievement data
      formDataToSend.append('achievement', JSON.stringify([achievementData]));

      if (showForm === "update") {
        await handleUpdate(id);
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/achievement/`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      fetchData();
      setShowForm("hidden");
      setFormData({ icons: null, title: "", number: 0 });
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Achievement ${showForm === "update" ? "Updated" : "Added"} Successfully!`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const handleUpdate = async (id) => {
    try {
      const formDataToSend = new FormData();
      
      const achievementData = {
        title: formData.title,
        number: formData.number
      };

      // Only append new icon if one was selected
      if (formData.icons && formData.icons instanceof File) {
        formDataToSend.append('achievement_icon', formData.icons);
      } else if (formData.existingIcon) {
        // If no new file, include the existing icon path in the achievement data
        achievementData.icons = formData.existingIcon;
      }
      
      formDataToSend.append('achievement', JSON.stringify([achievementData]));

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/achievement/${id}`,
        formDataToSend
      );
    } catch (error) {
      console.error("Error updating:", error);
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
        cancelButtonText: "No, cancel!",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/achievement/${id}`
        );
        fetchData();
        Swal.fire("Deleted!", "Achievement has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleShowForm = (achievementId, type) => {
    setShowForm(type);
    setId(achievementId);
    if (type === "update" && achievementId) {
      const achievement = data.find((a) => a._id === achievementId);
      if (achievement && achievement.achievement[0]) {
        setFormData({
          title: achievement.achievement[0].title,
          number: achievement.achievement[0].number,
          icons: achievement.achievement[0].icons,
          existingIcon: achievement.achievement[0].icons,
        });
      }
    } else {
      setFormData({ icons: null, title: "", number: 0, existingIcon: null });
    }
  };

  return (
    <div>
      {showForm !== "hidden" && (
        <form onSubmit={handleSubmit} className="bg-base-100 p-4 rounded-lg mb-4">
          <div className="grid gap-4">
            <InputText
              labelTitle="Title"
              defaultValue={formData.title}
              updateFormValue={handleChange}
              updateType="title"
            />
            <InputText
              labelTitle="Number"
              defaultValue={formData.number}
              type="number"
              updateFormValue={handleChange}
              updateType="number"
            />
            <InputText
              labelTitle="Icon"
              type="file"
              updateFormValue={handleFileChange}
              updateType="icons"
            />
            <div className="flex gap-4">
              <button type="submit" className="btn btn-primary flex-1">
                {showForm === "update" ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm("hidden")}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <TitleCard
        title="Achievements"
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons
            handleShowForm={handleShowForm}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item) => (
            <div key={item._id} className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10 bg-gray-900/20 rounded-lg">
                <img
                  src={`${process.env.REACT_APP_BASE_URL}/${item.achievement[0].icons}`}
                  alt={item.achievement[0].title}
                  className="w-20 h-20 object-contain"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{item.achievement[0].title}</h2>
                <p className="text-3xl font-bold">{item.achievement[0].number}</p>
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleShowForm(item._id, "update")}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(item._id)}
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
  );
};

export default Achievements;

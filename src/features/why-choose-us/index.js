import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import InputText from "../../components/Input/InputText";
import Swal from "sweetalert2";

const WhyChooseUs = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState("hidden");
  const [id, setId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    img: null,
    exp: [
      {
        icon: null,
        title: "",
        description: ""
      }
    ]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/why-choose-us`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data",
      });
    }
  };

  const handleChange = (value, field, expIndex) => {
    if (field.startsWith("exp")) {
      const [_, index, subField] = field.split(".");
      setFormData(prev => {
        const newExp = [...prev.exp];
        newExp[index] = { ...newExp[index], [subField]: value };
        return { ...prev, exp: newExp };
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileChange = (file, field, expIndex) => {
    if (field.includes("exp")) {
      const index = parseInt(field.split(".")[1]);
      const newExp = [...formData.exp];
      newExp[index].icon = file;
      setFormData(prev => ({ ...prev, exp: newExp }));
    } else {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      exp: [...prev.exp, { icon: null, title: "", description: "" }]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      exp: prev.exp.filter((_, i) => i !== index)
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle);

      const expJson = JSON.stringify(formData.exp.map(exp => ({
        title: exp.title,
        description: exp.description
      })));
      formDataToSend.append("exp", expJson);

      // Only append images if they were changed
      if (formData.img) {
        formDataToSend.append("img", formData.img);
      }
      
      formData.exp.forEach((exp) => {
        if (exp.icon) {
          formDataToSend.append("exp_icon", exp.icon);
        }
      });

      const requestOptions = {
        method: "PUT",
        body: formDataToSend,
        redirect: "follow"
      };

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/why-choose-us/${id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      fetchData();
      setShowForm("hidden");
    } catch (error) {
      console.error("Error updating:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update data",
      });
    }
  };

  return (
    <div>
      <TitleCard title="Why Choose Us" topMargin="mt-2">
        {data.map((item, index) => (
          <div key={index} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold">{item.title}</h2>
                <p className="text-gray-600 mt-2">{item.subtitle}</p>
              </div>
              <div className="text-right">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowForm("update");
                    setId(item._id);
                    setFormData({
                      title: item.title,
                      subtitle: item.subtitle,
                      img: null,
                      exp: item.exp.map(e => ({
                        title: e.title,
                        description: e.description,
                        icon: null
                      }))
                    });
                  }}
                >
                  Edit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {item.exp.map((exp, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={`${process.env.REACT_APP_BASE_URL}/${exp.icon}`}
                      alt={exp.title}
                      className="w-12 h-12 object-contain"
                    />
                    <h3 className="text-xl font-bold">{exp.title}</h3>
                  </div>
                  <p className="text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </TitleCard>

      {showForm === "update" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate(id);
          }}
          className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <InputText
              labelTitle="Title"
              defaultValue={formData.title}
              updateFormValue={handleChange}
              updateType="title"
            />
            <InputText
              labelTitle="Subtitle"
              defaultValue={formData.subtitle}
              updateFormValue={handleChange}
              updateType="subtitle"
            />
          </div>

          <div className="mb-6">
            <InputText
              labelTitle="Main Image"
              type="file"
              updateFormValue={handleFileChange}
              updateType="img"
            />
          </div>

          <div className="space-y-6">
            {formData.exp.map((exp, index) => (
              <div key={index} className="border p-4 rounded">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold">Experience {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputText
                    labelTitle="Icon"
                    type="file"
                    updateFormValue={handleFileChange}
                    updateType={`exp.${index}.icon`}
                  />
                  <InputText
                    labelTitle="Title"
                    defaultValue={exp.title}
                    updateFormValue={handleChange}
                    updateType={`exp.${index}.title`}
                  />
                  <div className="md:col-span-2">
                    <InputText
                      labelTitle="Description"
                      defaultValue={exp.description}
                      updateFormValue={handleChange}
                      updateType={`exp.${index}.description`}
                      type="textarea"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={addExperience}
              className="btn btn-secondary"
            >
              Add Experience
            </button>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WhyChooseUs;
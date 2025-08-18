import React, { useState, useEffect } from "react";
import axios from "axios";
import InputText from "../../components/Input/InputText";
import TitleCard from "../../components/Cards/TitleCard";
import Swal from "sweetalert2";

const About = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [showForm, setShowForm] = useState("hidden");
  const [formData, setFormData] = useState({
    title: "",
    description: "", 
    clientNo: "",
    homeImg: null,
    aboutImg1: null,
    aboutImg2: null,
    mission: [
      { icon: null, title: "", description: "" },
      { icon: null, title: "", description: "" }
    ],
    service: ["", "", ""]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/about`
      );
      if (response.data && response.data.length > 0) {
        setData([response.data[0]]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error Fetching Data",
        text: error.message,
      });
    }
  };

  const handleChange = (value, updateType) => {
    if (updateType.startsWith("mission")) {
      const [_, index, field] = updateType.split(".");
      setFormData(prev => {
        const newMission = [...prev.mission];
        newMission[index] = { ...newMission[index], [field]: value };
        return { ...prev, mission: newMission };
      });
    } else if (updateType.startsWith("service")) {
      const index = parseInt(updateType.split(".")[1]);
      setFormData(prev => {
        const newService = [...prev.service];
        newService[index] = value;
        return { ...prev, service: newService };
      });
    } else {
      setFormData(prev => ({ ...prev, [updateType]: value }));
    }
  };

  const handleFileChange = (file, updateType) => {
    if (updateType.startsWith("mission")) {
      const [_, index] = updateType.split(".");
      setFormData(prev => {
        const newMission = [...prev.mission];
        newMission[index] = { ...newMission[index], icon: file };
        return { ...prev, mission: newMission };
      });
    } else {
      setFormData(prev => ({ ...prev, [updateType]: file }));
    }
  };

  const handleUpdate = async (id) => {
    try {
      const formDataToSend = new FormData();
      
      // Append basic fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("clientNo", formData.clientNo);
      
      // Get current mission and service data
      const currentData = data.find(item => item._id === id);
      
      // Handle mission data
      formData.mission.forEach((item, index) => {
        if (item.icon) {
          // If there's a new icon, send it as a file
          formDataToSend.append(`mission[${index}][icon]`, item.icon);
        } else {
          // If no new icon, keep the existing one
          formDataToSend.append(`mission[${index}][icon]`, currentData.mission[index].icon);
        }
        formDataToSend.append(`mission[${index}][title]`, item.title);
        formDataToSend.append(`mission[${index}][description]`, item.description);
      });

      // Append service array
      formData.service.forEach((item, index) => {
        formDataToSend.append(`service[${index}]`, item);
      });

      // Append images only if they are changed
      if (formData.homeImg) formDataToSend.append("homeImg", formData.homeImg);
      if (formData.aboutImg1) formDataToSend.append("aboutImg1", formData.aboutImg1);
      if (formData.aboutImg2) formDataToSend.append("aboutImg2", formData.aboutImg2);

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/about/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data Updated Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      fetchData();
      setShowForm("hidden");
    } catch (error) {
      console.error("Error updating data:", error);
      Swal.fire({
        icon: "error",
        title: "Error Updating Data",
        text: error.message,
      });
    }
  };

  return (
    <div>
      <TitleCard title="About Us" topMargin="mt-2">
        <div className="overflow-x-auto w-full">
          {data.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Title</h2>
                  <p className="text-gray-700">{item.title}</p>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Client Number</h2>
                  <p className="text-gray-700">{item.clientNo}+ Clients</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Mission</h2>
                  <div className="grid gap-4">
                    {item.mission.map((mission, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded">
                    
                        <div>
                          <h3 className="font-bold">{mission.title}</h3>
                          <p className="text-gray-600">{mission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">Services</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {item.service.map((service, idx) => (
                      <li key={idx} className="text-gray-700">{service}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <img 
                  src={`${process.env.REACT_APP_BASE_URL}/${item.homeImg}`}
                  alt="Home"
                  className="w-full h-48 object-cover rounded"
                />
                <img 
                  src={`${process.env.REACT_APP_BASE_URL}/${item.aboutImg1}`}
                  alt="About 1"
                  className="w-full h-48 object-cover rounded"
                />
                <img 
                  src={`${process.env.REACT_APP_BASE_URL}/${item.aboutImg2}`}
                  alt="About 2"
                  className="w-full h-48 object-cover rounded"
                />
              </div>

              <div className="flex justify-end">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowForm("update");
                    setId(item._id);
                    setFormData({
                      title: item.title,
                      description: item.description,
                      clientNo: item.clientNo,
                      mission: item.mission.map(m => ({
                        title: m.title,
                        description: m.description,
                        icon: null
                      })),
                      service: item.service,
                      homeImg: null,
                      aboutImg1: null,
                      aboutImg2: null,
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </TitleCard>

      {showForm === "update" && (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(id);
        }} className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InputText
                labelTitle="Title"
                defaultValue={formData.title}
                updateFormValue={handleChange}
                updateType="title"
              />
            </div>
            <div>
              <InputText
                labelTitle="Client Number"
                defaultValue={formData.clientNo}
                updateFormValue={handleChange}
                updateType="clientNo"
                type="number"
              />
            </div>
            <div className="md:col-span-2">
              <InputText
                labelTitle="Description"
                defaultValue={formData.description}
                updateFormValue={handleChange}
                updateType="description"
                type="textarea"
              />
            </div>

            {formData.mission.map((item, index) => (
              <div key={index} className="md:col-span-2 border p-4 rounded">
                <h3 className="font-bold mb-2">Mission {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
                  <InputText
                    labelTitle="Title"
                    defaultValue={item.title}
                    updateFormValue={handleChange}
                    updateType={`mission.${index}.title`}
                  />
                  <InputText
                    labelTitle="Description"
                    defaultValue={item.description}
                    updateFormValue={handleChange}
                    updateType={`mission.${index}.description`}
                  />
                </div>
              </div>
            ))}

            {formData.service.map((service, index) => (
              <div key={index}>
                <InputText
                  labelTitle={`Service ${index + 1}`}
                  defaultValue={service}
                  updateFormValue={handleChange}
                  updateType={`service.${index}`}
                />
              </div>
            ))}

            <div>
              <InputText
                labelTitle="Home Image"
                type="file"
                updateFormValue={handleFileChange}
                updateType="homeImg"
              />
            </div>
            <div>
              <InputText
                labelTitle="About Image 1"
                type="file"
                updateFormValue={handleFileChange}
                updateType="aboutImg1"
              />
            </div>
            <div>
              <InputText
                labelTitle="About Image 2"
                type="file"
                updateFormValue={handleFileChange}
                updateType="aboutImg2"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowForm("hidden")}
            >
              Cancel
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

export default About;
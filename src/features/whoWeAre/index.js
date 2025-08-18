import React, { useState, useEffect } from "react";
import axios from "axios";
import InputText from "../../components/Input/InputText";
import TitleCard from "../../components/Cards/TitleCard";
import Swal from "sweetalert2";

const WhoWeAre = () => {
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState("hidden");
  const [formData, setFormData] = useState({
    whoWeAre: {
      description1: "GenShifter Technologies. is a leading IT company based in Addis Ababa, Ethiopia, dedicated to providing innovative software solutions and services to both national and international clients. Since our inception, we have been committed to delivering high-quality, customized software solutions that meet the unique needs of our clients across various industries.",
      description2: "Our team of highly skilled professionals is passionate about technology and innovation. We specialize in a wide range of IT services, including software development, system integration, IT consulting, and project management. Our goal is to help businesses leverage technology to improve efficiency, drive growth, and achieve their objectives."
    },
    ourMission: {
      description: "To empower businesses through innovative and reliable software solutions that drive growth and efficiency. We are dedicated to delivering exceptional value by leveraging the latest technologies and fostering a culture of continuous improvement."
    },
    ourVision: {
      description: "To be the leading software solutions provider in Ethiopia and a trusted partner for businesses worldwide. We aim to set the benchmark for excellence and innovation in the IT industry across our region and beyond."
    },
    img: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/who-we-are`
      );
      setData(response.data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (value, section, field) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  const handleFileChange = (files) => {
    setFormData({
      ...formData,
      img: Array.from(files)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Add each field individually to match the backend structure
      formDataToSend.append('whoWeAre[description1]', formData.whoWeAre.description1);
      formDataToSend.append('whoWeAre[description2]', formData.whoWeAre.description2);
      formDataToSend.append('ourMission[description]', formData.ourMission.description);
      formDataToSend.append('ourVision[description]', formData.ourVision.description);
      
      // Append images
      formData.img.forEach((file) => {
        formDataToSend.append('img', file);
      });

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/who-we-are/${data._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Data successfully updated:", response.data);
      fetchData();
      setShowForm("hidden");
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Information Updated Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error updating data:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error updating information",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <>
      <TitleCard title="Who We Are" topMargin="mt-2">
        {data && (
          <div className="overflow-x-auto w-full">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Who We Are</h2>
                <p className="mb-2">{data.whoWeAre.description1}</p>
                <p>{data.whoWeAre.description2}</p>
                
                <h2 className="text-xl font-bold mt-4 mb-2">Our Mission</h2>
                <p>{data.ourMission.description}</p>
                
                <h2 className="text-xl font-bold mt-4 mb-2">Our Vision</h2>
                <p>{data.ourVision.description}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-2">Images</h2>
                <div className="grid grid-cols-3 gap-2">
                  {data.img.map((img, index) => (
                    <img 
                      key={index}
                      src={`${process.env.REACT_APP_BASE_URL}/${img}`} 
                      alt={`Image ${index + 1}`}
                      className="w-32 h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary mt-4"
              onClick={() => setShowForm("update")}
            >
              Edit Information
            </button>
          </div>
        )}

        {showForm === "update" && data && (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-4">
            <div className="mb-4">
              <InputText
                labelTitle="Who We Are - Description 1:"
                defaultValue={data.whoWeAre.description1}
                updateFormValue={(value) => handleChange(value, 'whoWeAre', 'description1')}
              />
            </div>

            <div className="mb-4">
              <InputText
                labelTitle="Who We Are - Description 2:"
                defaultValue={data.whoWeAre.description2}
                updateFormValue={(value) => handleChange(value, 'whoWeAre', 'description2')}
              />
            </div>

            <div className="mb-4">
              <InputText
                labelTitle="Our Mission:"
                defaultValue={data.ourMission.description}
                updateFormValue={(value) => handleChange(value, 'ourMission', 'description')}
              />
            </div>

            <div className="mb-4">
              <InputText
                labelTitle="Our Vision:"
                defaultValue={data.ourVision.description}
                updateFormValue={(value) => handleChange(value, 'ourVision', 'description')}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Images:</label>
              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
                className="mt-1 block w-full"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </form>
        )}
      </TitleCard>
    </>
  );
};

export default WhoWeAre;
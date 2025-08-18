import React, { useState, useEffect } from "react";
import axios from "axios";
import InputText from "../../components/Input/InputText";
import ErrorText from "../../components/Typography/ErrorText";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";

import Swal from "sweetalert2";

const Contact = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [formData, setFormData] = useState({
    address: "",
    email: "",
    phone1: "",
    phone2: "",
    phone3: "",
    telegram: "",
    twitter: "",
    location: "",
    facebook: "",
    linkedin: ""
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
        `${process.env.REACT_APP_BASE_URL}/api/contact`
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
        address: "",
        email: "",
        phone1: "",
        phone2: "",
        phone3: "",
        telegram: "",
        twitter: "",
        location: "",
        facebook: "",
        linkedin: ""
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
      formDataToSend.append("address", formData.address);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone1", formData.phone1);
      formDataToSend.append("phone2", formData.phone2);
      formDataToSend.append("phone3", formData.phone3);
      formDataToSend.append("telegram", formData.telegram);
      formDataToSend.append("twitter", formData.twitter);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("facebook", formData.facebook);
      formDataToSend.append("linkedin", formData.linkedin);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/contact/`,
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
        address: "",
        email: "",
        phone1: "",
        phone2: "",
        phone3: "",
        telegram: "",
        twitter: "",
        location: "",
        facebook: "",
        linkedin: ""
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

      // Only append fields that have values
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/contact/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Item updated successfully:", response.data);
      fetchData(); // Refresh data after update
      
      // Reset form and state after successful update
      setId("");
      setFormData({
        address: "",
        email: "",
        phone1: "",
        phone2: "",
        phone3: "",
        telegram: "",
        twitter: "",
        location: "",
        facebook: "",
        linkedin: ""
      });
      setShowForm("hidden");
      
      // Show success message
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Contact information has been updated!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error updating item:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error updating contact information",
        text: "Please try again",
        showConfirmButton: true,
      });
    }
  };

  const handleShowForm = (id, type) => {
    setShowForm(type);
    setId(id);
    
    if (type === "update") {
      // Find the contact data for the given id
      const contactToEdit = data.find(item => item._id === id);
      if (contactToEdit) {
        // Pre-fill the form with existing data
        setFormData({
          address: contactToEdit.address || "",
          email: contactToEdit.email || "",
          phone1: contactToEdit.phone1 || "",
          phone2: contactToEdit.phone2 || "",
          phone3: contactToEdit.phone3 || "",
          telegram: contactToEdit.telegram || "",
          twitter: contactToEdit.twitter || "",
          location: contactToEdit.location || "",
          facebook: contactToEdit.facebook || "",
          linkedin: contactToEdit.linkedin || ""
        });
      }
    }
  };

  const handleView = (contact) => {
    Swal.fire({
      title: '<h3 class="text-xl font-bold mb-4">Contact Information</h3>',
      html: `
        <div class="text-left p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-1 gap-4">
            <div class="border-b pb-2">
              <p class="text-gray-600 text-sm">Address</p>
              <p class="font-medium">${contact.address || '-'}</p>
            </div>
            
            <div class="border-b pb-2">
              <p class="text-gray-600 text-sm">Email</p>
              <p class="font-medium">${contact.email || '-'}</p>
            </div>
            
            <div class="border-b pb-2">
              <p class="text-gray-600 text-sm">Phone Numbers</p>
              <p class="font-medium">${contact.phone1 || '-'}</p>
              <p class="font-medium">${contact.phone2 || '-'}</p>
              <p class="font-medium">${contact.phone3 || '-'}</p>
            </div>
            
            <div class="border-b pb-2">
              <p class="text-gray-600 text-sm">Social Media</p>
              <div class="grid grid-cols-2 gap-2 mt-1">
                ${contact.telegram ? `<a href="${contact.telegram}" target="_blank" class="text-blue-600 hover:underline">Telegram</a>` : ''}
                ${contact.twitter ? `<a href="${contact.twitter}" target="_blank" class="text-blue-600 hover:underline">Twitter</a>` : ''}
                ${contact.facebook ? `<a href="${contact.facebook}" target="_blank" class="text-blue-600 hover:underline">Facebook</a>` : ''}
                ${contact.linkedin ? `<a href="${contact.linkedin}" target="_blank" class="text-blue-600 hover:underline">LinkedIn</a>` : ''}
              </div>
            </div>
            
            <div>
              <p class="text-gray-600 text-sm">Location</p>
              ${contact.location ? 
                `<a href="${contact.location}" target="_blank" class="text-blue-600 hover:underline">View on Google Maps</a>` : 
                '-'}
            </div>
          </div>
        </div>
      `,
      width: '600px',
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        container: 'custom-swal-container',
        popup: 'custom-swal-popup'
      }
    });
  };

  const formFields = (
    <>
      <div className="mb-4">
        <InputText
          labelTitle="Address:"
          defaultValue={formData.address}
          updateFormValue={handleChange}
          updateType="address"
        />
      </div>
      <div className="mb-4">
        <InputText
          labelTitle="Email:"
          defaultValue={formData.email}
          updateFormValue={handleChange}
          updateType="email"
        />
      </div>
      <div className="mb-4">
        <InputText
          labelTitle="Phone 1:"
          defaultValue={formData.phone1}
          updateFormValue={handleChange}
          updateType="phone1"
        />
      </div>
      <div className="mb-4">
        <InputText
          labelTitle="Phone 2:"
          defaultValue={formData.phone2}
          updateFormValue={handleChange}
          updateType="phone2"
        />
      </div>
      <div className="mb-4">
        <InputText
          labelTitle="Phone 3:"
          defaultValue={formData.phone3}
          updateFormValue={handleChange}
          updateType="phone3"
        />
      </div>
      <div className="mb-4">
        <InputText
          labelTitle="Telegram:"
          defaultValue={formData.telegram}
          updateFormValue={handleChange}
          updateType="telegram"
        />
      </div>
      <div className="mb-4">
        <InputText
          labelTitle="Twitter:"
          defaultValue={formData.twitter}
          updateFormValue={handleChange}
          updateType="twitter"
        />
      </div>
      <div className="mb-4">
        <InputText
          labelTitle="Location:"
          defaultValue={formData.location}
          updateFormValue={handleChange}
          updateType="location"
        />
      </div>
      <div className="mb-4">
        <InputText
          labelTitle="Facebook:"
          defaultValue={formData.facebook}
          updateFormValue={handleChange}
          updateType="facebook"
        />
      </div>
      <div className="mb-4">
        <InputText
          labelTitle="LinkedIn:"
          defaultValue={formData.linkedin}
          updateFormValue={handleChange}
          updateType="linkedin"
        />
      </div>
    </>
  );

  return (
    <div>
      {showForm === "add" && (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          {formFields}
          <div className="mb-4">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      )}
      {showForm === "update" && (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          {formFields}
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
        >
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((l, k) => (
                  <tr key={k}>
                    <td>{k + 1}</td>
                    <td>{l.address}</td>
                    <td>{l.email}</td>
                    <td>{l.phone1}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm mr-2"
                        onClick={() => handleView(l)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        View
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleShowForm(l._id, "update")}
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
    </div>
  );
};

export default Contact;

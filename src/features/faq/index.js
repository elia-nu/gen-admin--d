import React, { useState, useEffect } from "react";
import axios from "axios";
import InputText from "../../components/Input/InputText";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import Swal from "sweetalert2";

const TopSideButtons = ({ applySearch, handleShowForm }) => {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    applySearch(searchText);
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

const FAQ = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [showForm, setShowForm] = useState("hidden");
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    img: null,
    existingImg: null,
    title: "",
    qa: [{ question: "", answer: "" }],
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/faq`
      );
      setData(response.data);
      setOriginalData(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (value, field, qaIndex) => {
    if (field === "title") {
      setFormData({ ...formData, title: value });
    } else if (field === "img") {
      setFormData({ ...formData, img: value });
    } else {
      const newQa = [...formData.qa];
      newQa[qaIndex] = { ...newQa[qaIndex], [field]: value };
      setFormData({ ...formData, qa: newQa });
    }
  };

  const addQaPair = () => {
    setFormData({
      ...formData,
      qa: [...formData.qa, { question: "", answer: "" }],
    });
  };

  const removeQaPair = (index) => {
    const newQa = formData.qa.filter((_, i) => i !== index);
    setFormData({ ...formData, qa: newQa });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    if (showForm === "update") {
      // Only append new image if one was selected
      if (formData.img) {
        formDataToSend.append("img", formData.img);
      }
    } else {
      formDataToSend.append("img", formData.img);
    }

    formDataToSend.append("title", formData.title);
    formDataToSend.append("qa", JSON.stringify(formData.qa));

    try {
      if (showForm === "update") {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/faq/${currentId}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire({
          icon: "success",
          title: "FAQ Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/faq`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire({
          icon: "success",
          title: "FAQ Added Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      fetchData();
      setShowForm("hidden");
      resetForm();
    } catch (error) {
      console.error("Error submitting FAQ:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      img: null,
      existingImg: null,
      title: "",
      qa: [{ question: "", answer: "" }],
    });
    setCurrentId(null);
  };

  const handleShowForm = (id, type) => {
    setShowForm(type);
    setCurrentId(id);

    if (type === "update") {
      const faqToEdit = data.find((item) => item._id === id);
      if (faqToEdit) {
        setFormData({
          img: null,
          existingImg: faqToEdit.img,
          title: faqToEdit.title,
          qa: faqToEdit.qa,
        });
      }
    }
  };

  const applySearch = (value) => {
    if (!value) {
      setData(originalData);
      return;
    }

    const filtered = originalData.filter(
      (item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.qa.some(
          (qa) =>
            qa.question.toLowerCase().includes(value.toLowerCase()) ||
            qa.answer.toLowerCase().includes(value.toLowerCase())
        )
    );
    setData(filtered);
  };

  return (
    <div>
      {(showForm === "add" || showForm === "update") && (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-8">
          <div className="mb-4">
            <InputText
              labelTitle="FAQ Title:"
              type="text"
              defaultValue={formData.title}
              updateFormValue={(value) => handleChange(value, "title")}
            />
          </div>

          {showForm === "add" && (
            <div className="mb-4">
              <InputText
                labelTitle="Image:"
                type="file"
                updateFormValue={(file) => handleChange(file, "img")}
              />
            </div>
          )}

          {showForm === "update" && (
            <div className="mb-4">
              <InputText
                labelTitle="Update Image (optional):"
                type="file"
                updateFormValue={(file) => handleChange(file, "img")}
              />
            </div>
          )}

          {formData.qa.map((qa, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <div className="mb-4">
                <InputText
                  labelTitle={`Question ${index + 1}:`}
                  defaultValue={qa.question}
                  updateFormValue={(value) =>
                    handleChange(value, "question", index)
                  }
                />
              </div>
              <div className="mb-4">
                <InputText
                  labelTitle="Answer:"
                  defaultValue={qa.answer}
                  updateFormValue={(value) =>
                    handleChange(value, "answer", index)
                  }
                />
              </div>
              {formData.qa.length > 1 && (
                <button
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() => removeQaPair(index)}
                >
                  Remove Q&A
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addQaPair}
            >
              Add Q&A Pair
            </button>
            <button type="submit" className="btn btn-primary">
              {showForm === "update" ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      )}

      <TitleCard
        title="FAQ Management"
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons
            applySearch={applySearch}
            handleShowForm={handleShowForm}
          />
        }
      >
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Image</th>
                <th>Q&A Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((faq, index) => (
                <tr key={index}>
                  <td>{faq.title}</td>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={`${process.env.REACT_APP_BASE_URL}/${faq.img}`}
                          alt="FAQ"
                        />
                      </div>
                    </div>
                  </td>
                  <td>{faq.qa.length}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleShowForm(faq._id, "update")}
                    >
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

export default FAQ;

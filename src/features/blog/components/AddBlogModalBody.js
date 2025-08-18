import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import MarkdownEditor from "../../../components/Input/MarkdownEditor";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";
import { createBlog } from "../blogSlice";

const INITIAL_BLOG_OBJ = {
  title: "",
  description: "",
  descriptionHtml: "",
  overview: "",
  image1: null,
  image2: null,
  image3: null,
  link1: "",
  link2: "",
  tag1: "",
  tag2: "",
  tag3: "",
  tag4: "",
};

function AddBlogModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [blogObj, setBlogObj] = useState(INITIAL_BLOG_OBJ);

  const saveNewBlog = async () => {
    // Clear any existing error messages
    setErrorMessage("");

    // Validate required fields
    if (!blogObj.title || blogObj.title.trim() === "") {
      return setErrorMessage("Blog title is required!");
    }
    if (!blogObj.description || blogObj.description.trim() === "") {
      return setErrorMessage("Blog content is required!");
    }
    if (!blogObj.overview || blogObj.overview.trim() === "") {
      return setErrorMessage("Blog overview is required!");
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const formData = new FormData();
      formData.append("title", blogObj.title);
      formData.append("description", blogObj.description);
      formData.append("descriptionHtml", blogObj.descriptionHtml);
      formData.append("overview", blogObj.overview);
      formData.append("link1", blogObj.link1);
      formData.append("link2", blogObj.link2);
      formData.append("tag1", blogObj.tag1);
      formData.append("tag2", blogObj.tag2);
      formData.append("tag3", blogObj.tag3);
      formData.append("tag4", blogObj.tag4);

      if (blogObj.image1) formData.append("image1", blogObj.image1);
      if (blogObj.image2) formData.append("image2", blogObj.image2);
      if (blogObj.image3) formData.append("image3", blogObj.image3);

      await dispatch(createBlog(formData)).unwrap();

      dispatch(showNotification({ message: "New Blog Created!", status: 1 }));
      closeModal();
    } catch (error) {
      setErrorMessage(error.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  const updateFormValue = (value, updateType) => {
    setErrorMessage("");
    setBlogObj({ ...blogObj, [updateType]: value });
  };

  const handleFileChange = (updateType, file) => {
    setErrorMessage("");
    setBlogObj({ ...blogObj, [updateType]: file });
  };

  const handleMarkdownChange = (markdown, html) => {
    setErrorMessage("");
    setBlogObj({
      ...blogObj,
      description: markdown,
      descriptionHtml: html,
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputText
          type="text"
          defaultValue={blogObj.title}
          updateType="title"
          containerStyle="mt-4"
          labelTitle="Blog Title"
          updateFormValue={updateFormValue}
        />

        <InputText
          type="text"
          defaultValue={blogObj.overview}
          updateType="overview"
          containerStyle="mt-4"
          labelTitle="Overview"
          updateFormValue={updateFormValue}
        />
      </div>

      <MarkdownEditor
        labelTitle="Blog Content (Markdown)"
        value={blogObj.description}
        onChange={handleMarkdownChange}
        placeholder="Write your blog content using Markdown..."
        height={300}
        containerStyle="mt-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <InputText
          type="text"
          defaultValue={blogObj.link1}
          updateType="link1"
          containerStyle=""
          labelTitle="Link 1"
          updateFormValue={updateFormValue}
        />

        <InputText
          type="text"
          defaultValue={blogObj.link2}
          updateType="link2"
          containerStyle=""
          labelTitle="Link 2"
          updateFormValue={updateFormValue}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <InputText
          type="text"
          defaultValue={blogObj.tag1}
          updateType="tag1"
          containerStyle=""
          labelTitle="Tag 1"
          updateFormValue={updateFormValue}
        />

        <InputText
          type="text"
          defaultValue={blogObj.tag2}
          updateType="tag2"
          containerStyle=""
          labelTitle="Tag 2"
          updateFormValue={updateFormValue}
        />

        <InputText
          type="text"
          defaultValue={blogObj.tag3}
          updateType="tag3"
          containerStyle=""
          labelTitle="Tag 3"
          updateFormValue={updateFormValue}
        />

        <InputText
          type="text"
          defaultValue={blogObj.tag4}
          updateType="tag4"
          containerStyle=""
          labelTitle="Tag 4"
          updateFormValue={updateFormValue}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-base-content">Image 1</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={(e) => handleFileChange("image1", e.target.files[0])}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-base-content">Image 2</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={(e) => handleFileChange("image2", e.target.files[0])}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-base-content">Image 3</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={(e) => handleFileChange("image3", e.target.files[0])}
          />
        </div>
      </div>

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={() => saveNewBlog()}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </div>
    </>
  );
}

export default AddBlogModalBody;

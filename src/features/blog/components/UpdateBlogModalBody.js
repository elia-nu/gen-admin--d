import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import MarkdownEditor from "../../../components/Input/MarkdownEditor";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";
import { updateBlog } from "../blogSlice";

function UpdateBlogModalBody({ blog, closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [blogObj, setBlogObj] = useState({
    title: blog.title || "",
    description: blog.description || "",
    descriptionHtml: blog.descriptionHtml || "",
    overview: blog.overview || "",
    image1: null,
    image2: null,
    image3: null,
    link1: blog.link1 || "",
    link2: blog.link2 || "",
    tag1: blog.tag1 || "",
    tag2: blog.tag2 || "",
    tag3: blog.tag3 || "",
    tag4: blog.tag4 || "",
  });

  const updateBlogData = async () => {
    if (blogObj.title.trim() === "")
      return setErrorMessage("Title is required!");
    if (blogObj.description.trim() === "")
      return setErrorMessage("Description is required!");
    if (blogObj.overview.trim() === "")
      return setErrorMessage("Overview is required!");

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

      await dispatch(updateBlog({ id: blog._id, blogData: formData })).unwrap();

      dispatch(showNotification({ message: "Blog Updated!", status: 1 }));
      closeModal();
    } catch (error) {
      setErrorMessage(error.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  const updateFormValue = (updateType, value) => {
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
            <span className="label-text text-base-content">
              Image 1{" "}
              {blog.image1 && "(Current: " + blog.image1.split("/").pop() + ")"}
            </span>
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
            <span className="label-text text-base-content">
              Image 2{" "}
              {blog.image2 && "(Current: " + blog.image2.split("/").pop() + ")"}
            </span>
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
            <span className="label-text text-base-content">
              Image 3{" "}
              {blog.image3 && "(Current: " + blog.image3.split("/").pop() + ")"}
            </span>
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
          onClick={() => updateBlogData()}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </div>
    </>
  );
}

export default UpdateBlogModalBody;

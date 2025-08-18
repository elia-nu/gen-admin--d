import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { deleteBlog, getBlogsContent } from "./blogSlice";
import SearchBar from "../../components/Input/SearchBar";
import MarkdownPreview from "../../components/Typography/MarkdownPreview";
import Swal from "sweetalert2";
import { showNotification } from "../common/headerSlice";
import { XMarkIcon } from "@heroicons/react/24/outline";

const TopSideButtons = ({ removeFilter, applyFilter, applySearch }) => {
  const [filterParam, setFilterParam] = useState("");
  const [searchText, setSearchText] = useState("");

  const showAddBlogModal = () => {
    dispatch(
      openModal({
        title: "Add New Blog",
        bodyType: "ADD_NEW_BLOG",
        size: "lg",
      })
    );
  };

  const dispatch = useDispatch();

  const removeAppliedFilter = () => {
    removeFilter();
    setFilterParam("");
    setSearchText("");
  };

  useEffect(() => {
    if (searchText === "") {
      removeAppliedFilter();
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
      {filterParam !== "" && (
        <button
          className="btn btn-xs mr-2 btn-active btn-ghost"
          onClick={() => removeAppliedFilter()}
        >
          {filterParam}
          <XMarkIcon className="w-4 ml-2" />
        </button>
      )}
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={() => showAddBlogModal()}
      >
        Add New Blog
      </button>
    </div>
  );
};

function Blog() {
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector((state) => state.blog);
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    dispatch(getBlogsContent());
  }, [dispatch]);

  useEffect(() => {
    setFilteredBlogs(blogs);
  }, [blogs]);

  const removeFilter = () => {
    setFilteredBlogs(blogs);
  };

  const applyFilter = (params) => {
    let filteredData = blogs.filter((blog) => {
      return (
        blog.tag1?.includes(params) ||
        blog.tag2?.includes(params) ||
        blog.tag3?.includes(params) ||
        blog.tag4?.includes(params)
      );
    });
    setFilteredBlogs(filteredData);
  };

  const applySearch = (value) => {
    let filteredData = blogs.filter((blog) => {
      return (
        blog.title?.toLowerCase().includes(value.toLowerCase()) ||
        blog.description?.toLowerCase().includes(value.toLowerCase()) ||
        blog.overview?.toLowerCase().includes(value.toLowerCase()) ||
        blog.tag1?.toLowerCase().includes(value.toLowerCase()) ||
        blog.tag2?.toLowerCase().includes(value.toLowerCase()) ||
        blog.tag3?.toLowerCase().includes(value.toLowerCase()) ||
        blog.tag4?.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredBlogs(filteredData);
  };

  const deleteBlogHandler = async (blog) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${blog.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteBlog(blog._id)).unwrap();
        dispatch(showNotification({ message: "Blog Deleted!", status: 1 }));
      } catch (error) {
        dispatch(
          showNotification({ message: "Error deleting blog", status: 0 })
        );
      }
    }
  };

  const updateBlogHandler = (blog) => {
    dispatch(
      openModal({
        title: "Update Blog",
        bodyType: "UPDATE_BLOG",
        extraObject: blog,
        size: "lg",
      })
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, length = 100) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <>
      <TitleCard
        title="Blogs Management"
        TopSideButtons={
          <TopSideButtons
            applySearch={applySearch}
            applyFilter={applyFilter}
            removeFilter={removeFilter}
          />
        }
      >
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Overview</th>
                  <th>Tags</th>
                  <th>Images</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-bold">{blog.title}</div>
                          <MarkdownPreview
                            content={blog.description}
                            maxLength={50}
                            className="text-sm opacity-50"
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {truncateText(blog.overview, 80)}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {blog.tag1 && (
                          <span className="badge badge-primary badge-sm">
                            {blog.tag1}
                          </span>
                        )}
                        {blog.tag2 && (
                          <span className="badge badge-secondary badge-sm">
                            {blog.tag2}
                          </span>
                        )}
                        {blog.tag3 && (
                          <span className="badge badge-accent badge-sm">
                            {blog.tag3}
                          </span>
                        )}
                        {blog.tag4 && (
                          <span className="badge badge-neutral badge-sm">
                            {blog.tag4}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex space-x-1">
                        {blog.image1 && (
                          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                            <span className="text-xs">1</span>
                          </div>
                        )}
                        {blog.image2 && (
                          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                            <span className="text-xs">2</span>
                          </div>
                        )}
                        {blog.image3 && (
                          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                            <span className="text-xs">3</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{formatDate(blog.createdAt)}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          className="btn btn-square btn-ghost btn-xs"
                          onClick={() => updateBlogHandler(blog)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          className="btn btn-square btn-ghost btn-xs text-red-500"
                          onClick={() => deleteBlogHandler(blog)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBlogs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8">
                      No blogs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </TitleCard>
    </>
  );
}

export default Blog;

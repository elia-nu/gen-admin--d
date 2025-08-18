import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import moment from "moment";
import Swal from "sweetalert2";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/contact-us`
      );
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch contact messages",
      });
      setLoading(false);
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
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/contact-us/${id}`
        );
        await fetchMessages();
        Swal.fire("Deleted!", "Message has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete message",
      });
    }
  };

  const handleViewMessage = (message) => {
    Swal.fire({
      title: `Message from ${message.name}`,
      html: `
        <div class="text-left p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-sm text-gray-500">Name</p>
              <p class="font-medium">${message.name}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="font-medium">${message.email}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Phone</p>
              <p class="font-medium">${message.phone}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Date</p>
              <p class="font-medium">${moment(message.createdAt).format("MMMM D, YYYY h:mm A")}</p>
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-2">Message</p>
            <p class="bg-white p-3 rounded-lg border border-gray-200">${message.message}</p>
          </div>
        </div>
      `,
      width: '700px',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-xl shadow-2xl'
      }
    });
  };

  return (
    <div>
      <TitleCard title="Contact Messages" topMargin="mt-2">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  <th className="rounded-tl-lg">Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th className="rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message, index) => (
                  <tr key={message._id} className="hover:bg-base-100 transition-colors duration-200">
                    <td className="font-medium">{message.name}</td>
                    <td className="text-blue-600">{message.email}</td>
                    <td>{message.phone}</td>
                    <td>{moment(message.createdAt).format("MMM D, YYYY")}</td>
                    <td className="space-x-2">
                      <button
                        className="btn btn-sm btn-info hover:btn-primary transition-colors duration-200"
                        onClick={() => handleViewMessage(message)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        View
                      </button>
                      <button
                        className="btn btn-sm btn-error hover:bg-red-600 transition-colors duration-200"
                        onClick={() => handleDelete(message._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TitleCard>
    </div>
  );
};

export default ContactMessages;
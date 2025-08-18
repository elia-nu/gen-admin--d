import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { 
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  TrashIcon,
  CheckCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const Career = () => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    description: '',
    requirements: [''] 
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [careers, setCareers] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/career`);
      setCareers(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch careers'
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.requirements.filter(req => req.trim()).length === 0) {
      newErrors.requirements = 'At least one requirement is needed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const removeRequirement = (index) => {
    if (formData.requirements.length === 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Remove',
        text: 'At least one requirement is needed'
      });
      return;
    }
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleEdit = (careerDoc, career) => {
    setEditMode(true);
    setEditId(careerDoc._id);
    setFormData({
      title: career.title,
      department: career.department,
      location: career.location,
      description: career.description,
      requirements: career.requirements
    });
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/career/${id}`);
        Swal.fire('Deleted!', 'Career has been deleted.', 'success');
        fetchCareers();
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to delete career', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please check all required fields'
      });
      return;
    }

    setLoading(true);
    
    try {
      const careerData = {
        career: [{
          title: formData.title.trim(),
          department: formData.department.trim(),
          location: formData.location.trim(),
          description: formData.description.trim(),
          requirements: formData.requirements.filter(req => req.trim() !== '')
        }]
      };

      if (editMode) {
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/career/${editId}`, careerData);
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Career opportunity updated successfully'
          });
        }
      } else {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/career`, careerData);
        if (response.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Career opportunity created successfully'
          });
        }
      }
      
      // Reset form
      setFormData({
        title: '',
        department: '',
        location: '',
        description: '', 
        requirements: ['']
      });
      setEditMode(false);
      setEditId(null);

      // Refresh careers list
      fetchCareers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to save career opportunity'
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Create Career Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <BriefcaseIcon className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? 'Edit Career Opportunity' : 'Create Career Opportunity'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500" />
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} 
                  rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-500" />
                Department *
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className={`w-full border ${errors.department ? 'border-red-500' : 'border-gray-300'}
                  rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className={`w-full border ${errors.location ? 'border-red-500' : 'border-gray-300'}
                  rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'}
                  rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                rows="4"
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-gray-500" />
                Requirements *
              </label>
              {errors.requirements && <p className="mt-1 text-sm text-red-500">{errors.requirements}</p>}
              
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md shadow-sm p-2.5 
                      focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter requirement"
                  />
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-md
                      transition duration-200 ease-in-out"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addRequirement}
                className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md
                  transition duration-200 ease-in-out flex items-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Add Requirement
              </button>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}
                  text-white rounded-md transition duration-200 ease-in-out mt-6 flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {editMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    {editMode ? 'Update Career' : 'Create Career'}
                  </>
                )}
              </button>

              {editMode && (
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setEditId(null);
                    setFormData({
                      title: '',
                      department: '',
                      location: '',
                      description: '',
                      requirements: ['']
                    });
                  }}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md
                    transition duration-200 ease-in-out mt-6 flex items-center justify-center"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Display Careers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Career Opportunities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((careerDoc) => (
            careerDoc.career.map((career, index) => (
              <div key={`${careerDoc._id}-${index}`} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-blue-600">{career.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(careerDoc, career)}
                      className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(careerDoc._id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    {career.department}
                  </p>
                  <p className="flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    {career.location}
                  </p>
                </div>
                <p className="mt-3 text-gray-700">{career.description}</p>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {career.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ))}
        </div>

        {careers.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No career opportunities available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default Career;
import React from "react";

interface ModalProps {
  onClose: () => void; // Function to close the modal
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
    sizes: {
      id: number;
      sizeValue: number;
      clothingType: {
        id: number;
        name: string;
      };
      sizeAttribute: {
        id: number;
        attributeName: string;
      };
    }[];
  } | null; // Customer data to be displayed in the modal
}

// Define types for Size and GroupedSizes
type Size = {
  id: number;
  sizeValue: number;
  clothingType: {
    id: number;
    name: string;
  };
  sizeAttribute: {
    id: number;
    attributeName: string;
  };
};

type GroupedSizes = {
  [key: string]: Size[];
};

const Modal: React.FC<ModalProps> = ({ onClose, customer }) => {
  if (!customer) return null; // If no customer, do not display modal

  // Group sizes by clothingType
  const groupedSizes = customer.sizes.reduce((acc: GroupedSizes, size) => {
    const { name } = size.clothingType;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(size);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-1/3 shadow-lg p-6 relative">
        {/* Button to close modal */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Modal content - customer information */}
        <h2 className="text-xl font-bold mb-4">Customer Detail</h2>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>

        <h3 className="mt-4 font-semibold">Size Information</h3>

        {/* Display table based on clothingType */}
        {Object.keys(groupedSizes).map((clothingType) => (
          <div key={clothingType} className="mt-4">
            <h4 className="text-lg font-bold mb-2">{clothingType}</h4>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {groupedSizes[clothingType].map((size) => (
                    <th key={size.sizeAttribute.id} className="border border-gray-300 px-4 py-2">
                      {size.sizeAttribute.attributeName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {groupedSizes[clothingType].map((size) => (
                    <td key={size.id} className="border border-gray-300 px-4 py-2">
                      {size.sizeValue} cm
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modal;

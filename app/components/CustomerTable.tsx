"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  sizes: {
    id: number; // Tambahkan ID untuk ukuran yang ingin dihapus
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
}

interface CustomerTableProps {
  clothingTypeFilter: string | null;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ clothingTypeFilter }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [uniqueAttributesByClothingType, setUniqueAttributesByClothingType] = useState<Record<string, string[]>>({});
  const router = useRouter();

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customer');
        const data = await res.json();

        // Filter customers who have relevant clothingType sizes
        const filteredCustomers = data.filter((customer: Customer) =>
          customer.sizes.some(size => !clothingTypeFilter || size.clothingType.name === clothingTypeFilter)
        );
        setCustomers(filteredCustomers);

        // Extract unique size attributes per clothingType
        const attributesByClothingType: Record<string, Set<string>> = {};
        filteredCustomers.forEach((customer: Customer) => {
          customer.sizes.forEach((size) => {
            const clothingType = size.clothingType.name;
            if (!attributesByClothingType[clothingType]) {
              attributesByClothingType[clothingType] = new Set<string>();
            }
            attributesByClothingType[clothingType].add(size.sizeAttribute.attributeName);
          });
        });

        // Convert to an object of arrays
        const attributesByClothingTypeArr = Object.fromEntries(
          Object.entries(attributesByClothingType).map(([clothingType, attributesSet]) => [
            clothingType,
            Array.from(attributesSet),
          ])
        );
        setUniqueAttributesByClothingType(attributesByClothingTypeArr);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [clothingTypeFilter]);

  const handleDeleteSize = async (sizeId: number) => {
    try {
      const res = await fetch(`/api/customersize/${sizeId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCustomers(prevCustomers =>
          prevCustomers.map(customer => ({
            ...customer,
            sizes: customer.sizes.filter(size => size.id !== sizeId),
          }))
        );
      } else {
        console.error('Failed to delete size');
      }
    } catch (error) {
      console.error('Error deleting size:', error);
    }
  };

  const handleUpdateSize = (sizeId: number) => {
    if (sizeId) {
      router.push(`/customers/editcustomersize?id=${sizeId}`);
    } else {
      console.error('Size ID is not valid');
    }
  };
  

  if (loading) {
    return <p>Loading customers...</p>;
  }

  if (customers.length === 0) {
    return <p>No customers found for {clothingTypeFilter ? clothingTypeFilter : 'all types'}.</p>;
  }

  // Function to get the headers dynamically based on the clothingTypeFilter
  const getHeaders = () => {
    if (clothingTypeFilter) {
      return uniqueAttributesByClothingType[clothingTypeFilter] || [];
    } else {
      // Return attributes for all clothing types if no filter
      const allAttributes = new Set<string>();
      Object.values(uniqueAttributesByClothingType).forEach((attributes) => {
        attributes.forEach((attr) => allAttributes.add(attr));
      });
      return Array.from(allAttributes);
    }
  };

  const headers = getHeaders();

  return (
    <div>
      <h1>Customer List {clothingTypeFilter ? `for ${clothingTypeFilter}` : ''}</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            {clothingTypeFilter ? (
              headers.map((header, index) => (
                <th key={index} className="border border-gray-300 px-4 py-2">
                  {header} (cm)
                </th>
              ))
            ) : (
              Object.keys(uniqueAttributesByClothingType).map((clothingType, index) => (
                <th key={index} className="border border-gray-300 px-4 py-2">
                  {clothingType}
                </th>
              ))
            )}
            <th className="border border-gray-300 px-4 py-2">Actions</th> {/* Column for actions */}
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="border border-gray-300 px-4 py-2">{customer.name}</td>
              <td className="border border-gray-300 px-4 py-2">{customer.email}</td>
              <td className="border border-gray-300 px-4 py-2">{customer.phone}</td>
              {clothingTypeFilter ? (
                headers.map((header, index) => {
                  const size = customer.sizes.find(
                    (s) =>
                      s.sizeAttribute.attributeName === header &&
                      s.clothingType.name === clothingTypeFilter
                  );
                  return (
                    <td key={index} className="border border-gray-300 px-4 py-2">
                      {size ? `${size.sizeValue} cm` : '-'}
                    </td>
                  );
                })
              ) : (
                Object.keys(uniqueAttributesByClothingType).map((clothingType, index) => (
                  <td key={index} className="border border-gray-300 px-4 py-2">
                    {customer.sizes
                      .filter((s) => s.clothingType.name === clothingType)
                      .map((s) => `${s.sizeAttribute.attributeName}: ${s.sizeValue} cm`)
                      .join(', ') || '-'}
                  </td>
                ))
              )}
              <td className="border border-gray-300 px-4 py-2">
                {clothingTypeFilter && (
                    <div>

                  <button
                    onClick={() => handleDeleteSize(customer.sizes[0]?.id ?? -1)} // Modify this to select the right size ID
                    className="bg-red-500 text-white px-4 py-1 rounded"
                    >
                    Delete
                  </button>

                  <button
                  onClick={() => handleUpdateSize(customer.sizes[0]?.id ?? -1)} // Modify this to select the right size ID
                  className="bg-yellow-500 text-white px-4 py-1 rounded"
                  >
                  Edit
                </button>
                    </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;

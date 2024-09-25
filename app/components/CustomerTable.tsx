"use client"
// components/CustomerTable.tsx
import { useState, useEffect } from 'react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  sizes: {
    sizeValue: number;
    clothingType: {
      name: string;
    };
    sizeAttribute: {
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
  const [uniqueAttributes, setUniqueAttributes] = useState<string[]>([]);

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

        // Extract unique size attributes based on filtered data
        const attributes = new Set<string>();
        filteredCustomers.forEach((customer: Customer) => {
          customer.sizes.forEach((size) => {
            if (!clothingTypeFilter || size.clothingType.name === clothingTypeFilter) {
              attributes.add(size.sizeAttribute.attributeName);
            }
          });
        });
        setUniqueAttributes(Array.from(attributes));
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [clothingTypeFilter]);

  if (loading) {
    return <p>Loading customers...</p>;
  }

  if (customers.length === 0) {
    return <p>No customers found for {clothingTypeFilter ? clothingTypeFilter : 'all types'}.</p>;
  }

  return (
    <div>
      <h1>Customer List {clothingTypeFilter ? `for ${clothingTypeFilter}` : ''}</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            {uniqueAttributes.map((attribute, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2">{attribute}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="border border-gray-300 px-4 py-2">{customer.name}</td>
              <td className="border border-gray-300 px-4 py-2">{customer.email}</td>
              <td className="border border-gray-300 px-4 py-2">{customer.phone}</td>
              {uniqueAttributes.map((attribute, index) => {
                const size = customer.sizes.find(
                  (s) =>
                    s.sizeAttribute.attributeName === attribute &&
                    (!clothingTypeFilter || s.clothingType.name === clothingTypeFilter)
                );
                return (
                  <td key={index} className="border border-gray-300 px-4 py-2">
                    {size ? `${size.sizeValue} cm` : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;

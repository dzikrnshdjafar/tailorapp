"use client"
// pages/customers/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Tambahkan ini
import CustomerTable from '../components/CustomerTable';

const CustomerListPage = () => {
  const [clothingTypes, setClothingTypes] = useState<string[]>([]);
  const [selectedClothingType, setSelectedClothingType] = useState<string | null>(null);
  const router = useRouter(); // Tambahkan ini

  // Fetch unique clothing types from customers data
  useEffect(() => {
    const fetchClothingTypes = async () => {
      try {
        const res = await fetch('/api/customer');
        const data = await res.json();
        const types = new Set<string>();
        data.forEach((customer: any) => {
          customer.sizes.forEach((size: any) => {
            types.add(size.clothingType.name);
          });
        });
        setClothingTypes(Array.from(types));
      } catch (error) {
        console.error('Error fetching clothing types:', error);
      }
    };

    fetchClothingTypes();
  }, []);

  // Handler for navigation to add customer form
  const handleAddCustomer = () => {
    router.push('/customers/createcustomer'); // Navigasi ke halaman tambah pelanggan
  };

  // Handler for navigation to add customer form
  const handleAddCustomerSize = () => {
    router.push('/customers/createcustomersize'); // Navigasi ke halaman tambah pelanggan
  };

  return (
    <div>
      <h1>Customer List</h1>

      {/* Buttons for filtering by clothing type */}
      <div className="mb-4">
        <button
          className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setSelectedClothingType(null)}
        >
          All
        </button>
        {clothingTypes.map((type, index) => (
          <button
            key={index}
            className={`mr-2 px-4 py-2 rounded ${selectedClothingType === type ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setSelectedClothingType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Button to navigate to Add Customer form */}
      <div className="mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleAddCustomer} // Ketika tombol diklik, akan menuju ke halaman tambah customer
        >
          Add New Customer
        </button>
      </div>
      <div className="mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleAddCustomerSize} // Ketika tombol diklik, akan menuju ke halaman tambah customer
        >
          Add New Customer Size
        </button>
      </div>

      {/* Customer Table filtered by selected clothing type */}
      <CustomerTable clothingTypeFilter={selectedClothingType} clothingTypes={clothingTypes} />
    </div>
  );
};

export default CustomerListPage;

"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Import untuk mengelola cookies
import CustomerTable from '@/app/components/CustomerTable';


// Mendefinisikan tipe data untuk Size dan Customer
interface Size {
  clothingType: {
    name: string;
  };
}

interface Customer {
  sizes: Size[];
}


const CustomerListPage = () => {
  const [clothingTypes, setClothingTypes] = useState<string[]>([]);
  const [selectedClothingType, setSelectedClothingType] = useState<string | null>(null);
  const router = useRouter();

  // Fetch unique clothing types from customers data
  useEffect(() => {
    const fetchClothingTypes = async () => {
      try {
        const res = await fetch('/api/customer');
        const data: Customer[] = await res.json(); // Menggunakan tipe Customer di sini
        const types = new Set<string>();
        data.forEach((customer) => {
          customer.sizes.forEach((size) => {
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
    router.push('/customers/createcustomer');
  };

  // Handler for navigation to add customer size form
  const handleAddCustomerSize = () => {
    router.push('/customers/createcustomersize');
  };

  // Handler for logout
  const handleLogout = () => {
    // Hapus token dari cookies dan localStorage
    Cookies.remove('token');
    localStorage.removeItem('token');
    // Redirect ke halaman login
    router.push('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Customer List</h1>

      {/* Buttons for filtering by clothing type */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={() => setSelectedClothingType(null)}
        >
          All
        </button>
        {clothingTypes.map((type, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded ${
              selectedClothingType === type
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-800 hover:bg-gray-400 transition'
            }`}
            onClick={() => setSelectedClothingType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Button to navigate to Add Customer form */}
      <div className="mb-4 flex flex-col sm:flex-row justify-center gap-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full sm:w-auto"
          onClick={handleAddCustomer}
        >
          Add New Customer
        </button>

        {/* Button to navigate to Add Customer Size form */}
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full sm:w-auto"
          onClick={handleAddCustomerSize}
        >
          Add New Customer Size
        </button>
      </div>

      {/* Button for logout */}
      <div className="mb-4 flex justify-center">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Customer Table filtered by selected clothing type */}
      <div className="overflow-x-auto">
        <CustomerTable clothingTypeFilter={selectedClothingType} clothingTypes={clothingTypes} />
      </div>
    </div>
  );
};

export default CustomerListPage;

"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";

interface Customer {
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
}

interface CustomerTableProps {
  clothingTypeFilter: string | null;
  clothingTypes: string[];
}

const CustomerTable: React.FC<CustomerTableProps> = ({ clothingTypeFilter, clothingTypes }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
  const [editedSizes, setEditedSizes] = useState<{ [key: number]: string }>({});
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null); // Untuk Modal
  const [showDetailModal, setShowDetailModal] = useState(false); // State untuk mengelola modal
  const [searchQuery, setSearchQuery] = useState(""); // State untuk query pencarian
  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customer");
        const data = await res.json();

        // Filter customers by selected clothing type
        const filteredCustomers = data.filter((customer: Customer) =>
          customer.sizes.some(
            (size) =>
              !clothingTypeFilter || size.clothingType.name === clothingTypeFilter
          )
        );
        setCustomers(filteredCustomers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [clothingTypeFilter]);

  // Fungsi pencarian
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

    // Filter customers berdasarkan searchQuery
    const filteredCustomers = customers.filter((customer) => {
      const lowercasedQuery = searchQuery.toLowerCase();
      return (
        customer.name.toLowerCase().includes(lowercasedQuery)
        // || customer.email.toLowerCase().includes(lowercasedQuery) 
        // || customer.phone.includes(lowercasedQuery)
      );
    });

  const handleEditClick = (customerId: number) => {
    setEditingCustomerId(customerId);
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      const initialSizes = customer.sizes.reduce((acc, size) => {
        acc[size.id] = size.sizeValue.toString();
        return acc;
      }, {} as { [key: number]: string });
      setEditedSizes(initialSizes);
    }
  };

  const handleSizeChange = (sizeId: number, value: string) => {
    setEditedSizes((prevSizes) => ({
      ...prevSizes,
      [sizeId]: value,
    }));
  };

  const handleSave = async (customerId: number, clothingType: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    // Tambahkan konfirmasi sebelum penghapusan
   const confirmUpdate = window.confirm(
    `Yakin mo ubah ukuran ${clothingType} dari ${customer.name}?`
  );

  if (!confirmUpdate) {
    return; // Batalkan jika pengguna memilih "Cancel"
  }

    const updatedSizesByClothingType = clothingTypes
      .map((type) => {
        const sizesForType = customer.sizes.filter(
          (size) => size.clothingType.name === type
        );
        const sizes = sizesForType.map((size) => ({
          sizeAttributeId: size.sizeAttribute.id,
          sizeValue: parseFloat(editedSizes[size.id]) || size.sizeValue,
        }));
        return {
          clothingTypeId: sizesForType[0]?.clothingType.id,
          sizes: sizes,
        };
      })
      .filter((clothingType) => clothingType.clothingTypeId);

    const body = {
      customerId,
      clothingTypes: updatedSizesByClothingType,
    };

    try {
      const res = await fetch(`/api/customersize/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const updatedCustomer = {
          ...customer,
          sizes: customer.sizes.map((size) => ({
            ...size,
            sizeValue: parseFloat(editedSizes[size.id]) || size.sizeValue,
          })),
        };

        setCustomers((prevCustomers) =>
          prevCustomers.map((c) => (c.id === customerId ? updatedCustomer : c))
        );

        setEditingCustomerId(null);
      } else {
        console.error("Failed to save sizes");
      }
    } catch (error) {
      console.error("Error updating sizes:", error);
    }
  };

  const handleCancel = () => {
    setEditingCustomerId(null);
    setEditedSizes({});
  };

  const handleDetailClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true); // Tampilkan modal
  };

  const closeModal = () => {
    setShowDetailModal(false);
  };

  if (loading) {
    return <p>Loading customers...</p>;
  }

    // Fungsi untuk menghapus ukuran berdasarkan clothingType
const handleDelete = async (customerId: number, clothingType: string) => {
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return;

   // Tambahkan konfirmasi sebelum penghapusan
   const confirmDelete = window.confirm(
    `Yakin mo hapus ukuran ${clothingType} dari ${customer.name}?`
  );

  if (!confirmDelete) {
    return; // Batalkan jika pengguna memilih "Cancel"
  }

  // Dapatkan semua ukuran yang sesuai dengan clothingType
  const sizesToDelete = customer.sizes
    .filter((size) => size.clothingType.name === clothingType)
    .map((size) => ({
      sizeAttributeId: size.sizeAttribute.id,
    }));

  // Ambil clothingTypeId dari ukuran pertama yang sesuai
  const clothingTypeId = customer.sizes.find(
    (size) => size.clothingType.name === clothingType
  )?.clothingType.id;

  if (!clothingTypeId || sizesToDelete.length === 0) return;

  const body = {
    customerId,
    clothingTypeId,
    sizes: sizesToDelete, // Array of sizeAttributeId to be deleted
  };

  try {
    const res = await fetch(`/api/customersize/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      // Update local state after deletion
      setCustomers((prevCustomers) =>
        prevCustomers.map((c) =>
          c.id === customerId
            ? {
                ...c,
                sizes: c.sizes.filter(
                  (size) => size.clothingType.name !== clothingType
                ),
              }
            : c
        )
      );
    } else {
      console.error("Failed to delete sizes");
    }
  } catch (error) {
    console.error("Error deleting sizes:", error);
  }
};

  
    if (loading) {
      return <p>Loading customers...</p>;
    }

  return (
    <div className="container mx-auto px-4 py-8">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search by name, email, or phone"
      className="mb-4 p-2 border border-gray-300 rounded w-full sm:w-1/2 lg:w-1/3"
    />
  
    <h1 className="text-2xl font-bold mb-4">
      Customer List {clothingTypeFilter ? `for ${clothingTypeFilter}` : ""}
    </h1>
  
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            {!clothingTypeFilter && 
            <>
            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
            </>
          }
            {clothingTypeFilter && customers.length > 0 &&
              customers[0].sizes
              .filter((size) => size.clothingType.name === clothingTypeFilter)
              .map((size) => (
                <th key={size.sizeAttribute.id} className="border border-gray-300 px-4 py-2 text-left">
                    {size.sizeAttribute.attributeName}
                  </th>
                ))}
            <th className="border border-gray-300 px-4 py-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{customer.name}</td>
              {!clothingTypeFilter && 
              <>
              <td className="border border-gray-300 px-4 py-2">{customer.email}</td>
              <td className="border border-gray-300 px-4 py-2">{customer.phone}</td>
              </>
              }
              {clothingTypeFilter &&
                customer.sizes
                  .filter((size) => size.clothingType.name === clothingTypeFilter)
                  .map((size) => (
                    <td key={size.id} className="border border-gray-300 px-4 py-2">
                      {editingCustomerId === customer.id ? (
                        <input
                          type="number"
                          value={editedSizes[size.id] || size.sizeValue.toString()}
                          onChange={(e) => handleSizeChange(size.id, e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        `${size.sizeValue} cm`
                      )}
                    </td>
                  ))}
              <td className="border border-gray-300 px-4 py-2">
                {clothingTypeFilter ? (
                  editingCustomerId === customer.id ? (
                    <>
                      <button
                        onClick={() => handleSave(customer.id, clothingTypeFilter)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(customer.id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold mr-2 py-1 px-3 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id, clothingTypeFilter)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )
                ) : (
                  <button
                    onClick={() => handleDetailClick(customer)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Detail
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    {showDetailModal && selectedCustomer && (
      <Modal onClose={closeModal} customer={selectedCustomer} />
    )}
  </div>
  
  );
};

export default CustomerTable;

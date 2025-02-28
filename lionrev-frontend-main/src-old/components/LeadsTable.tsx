import { useState } from 'react';
import { format } from 'date-fns';
import type { Lead } from '../types/Lead';

interface LeadsTableProps {
  leads: Lead[];
  columnVisibility: { [key: string]: boolean };
}

export const LeadsTable = ({ leads, columnVisibility }: LeadsTableProps) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleRowClick = (lead: Lead) => {
    console.log('Clicked Lead:', lead); // Debugging step
    setSelectedLead({ ...lead }); // Ensure a new object reference
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columnVisibility.fullName && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
              )}
              {columnVisibility.email && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
              )}
              {columnVisibility.phone && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr
                key={lead.id || Math.random()} // Ensure a unique key
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(lead)}
              >
                {columnVisibility.fullName && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.full_name}
                  </td>
                )}
                {columnVisibility.email && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.email}
                  </td>
                )}
                {columnVisibility.phone && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.phone_number}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Popup for Lead Details */}
      {selectedLead && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Lead Details</h2>
            {columnVisibility.service && (
              <p><strong>Service Interested:</strong> {selectedLead.services_interested}</p>
            )}
            {columnVisibility.revenue && (
              <p><strong>Revenue:</strong> ${selectedLead.revenue || 'N/A'}</p>
            )}
            {columnVisibility.zip && (
              <p><strong>Zip Code:</strong> {selectedLead.zip_code}</p>
            )}
            {columnVisibility.createdDate && (
              <p><strong>Created Date:</strong> {format(new Date(selectedLead.create_at), 'yyyy-MM-dd HH:mm:ss')}</p>
            )}
            <p><strong>Status:</strong> {selectedLead.status}</p>
            <button
              onClick={() => setSelectedLead(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

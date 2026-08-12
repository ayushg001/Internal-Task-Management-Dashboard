import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import Table from '../components/Table';
import Button from '../components/Button';
import { Globe, RefreshCw, Mail, Phone, Building, MapPin } from 'lucide-react';

export default function ExternalUsersPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getExternalUsers();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to fetch external API integration users.');
    } finally {
      setLoading(false);
    }
  };

  const headers = ['Name & Username', 'Email', 'Phone', 'Company', 'City / Location'];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">External Users API Integration</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Demonstrates integration with public REST APIs (<code className="bg-gray-100 px-1 py-0.5 rounded text-xs">JSONPlaceholder</code>) with error handling & timeout control.
          </p>
        </div>

        <Button onClick={fetchData} variant="outline" className="gap-2 shrink-0">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </Button>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg text-xs space-y-1">
        <p className="font-semibold">Backend Endpoint Integration Details:</p>
        <p>• Endpoint: <code className="bg-blue-100 px-1 py-0.5 rounded">GET /api/external/users</code></p>
        <p>• Features demonstrated: Native HTTP client, 5-second request timeout, rate-limit safeguards, response payload mapping.</p>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm">
          <p className="font-semibold">External Integration Error</p>
          <p className="mt-1 text-xs">{error}</p>
        </div>
      )}

      {/* Data Table */}
      {loading ? (
        <div className="bg-white p-12 border border-gray-200 rounded-lg text-center">
          <div className="animate-spin inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="text-sm text-gray-500 mt-2">Fetching external user profiles...</p>
        </div>
      ) : (
        <Table headers={headers} emptyMessage="No external users returned from API.">
          {data?.users?.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="font-semibold text-gray-900">{u.name}</div>
                <div className="text-xs text-gray-400">@{u.username}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{u.email}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{u.phone}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <div className="flex items-center gap-1 font-medium">
                  <Building className="w-3.5 h-3.5 text-gray-400" />
                  <span>{u.company}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{u.city}</span>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import Table from '../components/Table';
import { FileText, Code2, Server } from 'lucide-react';

export default function ApiDocsPage() {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      setLoading(true);
      const res = await apiService.getApiDocs();
      setDocs(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const headers = ['Method', 'Endpoint Path', 'Description'];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">{docs?.title || 'API Documentation'}</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">{docs?.description}</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded">
          v{docs?.version || '1.0.0'}
        </span>
      </div>

      {loading ? (
        <div className="bg-white p-12 text-center border border-gray-200 rounded-lg">
          <div className="animate-spin inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <Table headers={headers}>
          {docs?.endpoints?.map((ep, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-bold text-xs">
                <span className={`px-2 py-0.5 rounded ${
                  ep.method === 'GET' ? 'bg-green-100 text-green-800' :
                  ep.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  ep.method === 'PUT' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {ep.method}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-mono text-gray-800">{ep.path}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{ep.description}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}

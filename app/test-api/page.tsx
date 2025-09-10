"use client"

import { useState, useEffect } from "react"

export default function TestApiPage() {
  const [results, setResults] = useState<any>({})

  useEffect(() => {
    testApis()
  }, [])

  const testApis = async () => {
    const apis = [
      { name: 'Promotions', url: '/api/promotions?status=all' },
      { name: 'Partners', url: '/api/partners?status=all' },
      { name: 'Ads', url: '/api/ads?status=all' }
    ]

    const results: any = {}

    for (const api of apis) {
      try {
        console.log(`Testing ${api.name}...`)
        const response = await fetch(api.url)
        const data = await response.json()
        results[api.name] = {
          status: response.status,
          success: data.success,
          count: data[api.name.toLowerCase()]?.length || 0,
          data: data
        }
        console.log(`${api.name} result:`, results[api.name])
      } catch (error) {
        results[api.name] = {
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'ERROR'
        }
        console.error(`${api.name} error:`, error)
      }
    }

    setResults(results)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>

      <div className="space-y-6">
        {Object.entries(results).map(([apiName, result]: [string, any]) => (
          <div key={apiName} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">{apiName}</h2>

            {result.error ? (
              <div className="text-red-600">
                <p><strong>Error:</strong> {result.error}</p>
              </div>
            ) : (
              <div>
                <p><strong>Status:</strong> {result.status}</p>
                <p><strong>Success:</strong> {result.success ? 'Yes' : 'No'}</p>
                <p><strong>Count:</strong> {result.count}</p>

                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600">View Raw Data</summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={testApis}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Again
      </button>
    </div>
  )
}
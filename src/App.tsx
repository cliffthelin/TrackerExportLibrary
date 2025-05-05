import React from 'react'
import TaskList from './components.tsx'
import ZipImporter from './ZipImporter.tsx'
import TestPage from './pages/TestPage'

function App() {
  return (
    <div className="min-height-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
        <ZipImporter />
        <h1 className="text-3xl font-bold mb-6">
          SQLite Task App
        </h1>
        <TaskList />
        <hr />
        <TestPage />
      </div>
    </div>
  )
}

export default App

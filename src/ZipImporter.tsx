import React, { useState, useCallback } from 'react';
import * as jszip from 'jszip';
import { useDrop } from '@dnd-kit/core';

// Define TypeScript interfaces
interface Manifest {
  name: string;
  version: string;
}

interface Category {
  id: number;
  name: string;
}

interface Tracker {
  id: number;
  type: string;
}

interface TrackerField {
  id: number;
  name: string;
}

interface TrackerFieldAttribute {
  id: number;
  field_id: number;
  name: string;
  value: string;
}

interface Resource {
  id: number;
  url: string;
}

// JSON Safety Types
type JSONPrimitive = string | number | boolean | null | undefined;

type JSONValue = JSONPrimitive | JSONValue[] | {
  [key: string]: JSONValue;
};

type NotAssignableToJson =
  | bigint
  | symbol
  | Function;

type JSONCompatible<T> = unknown extends T ? never : {
  [P in keyof T]:
    T[P] extends JSONValue ? T[P] :
    T[P] extends NotAssignableToJson ? never :
    JSONCompatible<T[P]>;
};

function toJsonValue<T>(value: JSONCompatible<T>): JSONValue {
  return value;
}

function safeJsonStringify<T>(data: JSONCompatible<T>) {
  return JSON.stringify(data);
}

function safeJsonParse(text: string): unknown {
  return JSON.parse(text);
}

function ZipImporter() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [trackerFields, setTrackerFields] = useState<TrackerField[]>([]);
  const [trackerFieldAttributes, setTrackerFieldAttributes] = useState<TrackerFieldAttribute[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [testData, setTestData] = useState<string | null>(null);

  const handleDrop = useCallback(
    async (event) => {
      event.preventDefault();
      const file = (event.dataTransfer.files as FileList)[0];

      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          setError('File size exceeds 50MB.');
          return;
        }

        try {
          const zip = await jszip.loadAsync(file);
          const categoriesData = await zip.file('categories.ndjson')?.async('string') || '';
          const trackersData = await zip.file('trackers.ndjson')?.async('string') || '';
          const resourcesData = await zip.file('resources.ndjson')?.async('string') || '';
          const trackerFieldsData = await zip.file('tracker_fields.ndjson')?.async('string') || '';
          const trackerFieldAttributesData = await zip.file('tracker_field_attributes.ndjson')?.async('string') || '';

          // Parse NDJSON data
          const parsedCategories = categoriesData
            .split('\n')
            .map((line) => JSON.parse(line)) as Category[];
          const parsedTrackers = trackersData
            .split('\n')
            .map((line) => JSON.parse(line)) as Tracker[];
          const parsedResources = resourcesData
            .split('\n')
            .map((line) => JSON.parse(line)) as Resource[];
          const parsedTrackerFields = trackerFieldsData
            .split('\n')
            .map((line) => JSON.parse(line)) as TrackerField[];
          const parsedTrackerFieldAttributes = trackerFieldAttributesData
            .split('\n')
            .map((line) => JSON.parse(line)) as TrackerFieldAttribute[];

          setCategories(parsedCategories);
          setTrackers(parsedTrackers);
          setResources(parsedResources);
          setTrackerFields(parsedTrackerFields);
          setTrackerFieldAttributes(parsedTrackerFieldAttributes);
          setError(null);

          // Test Serialization/Deserialization
          const testObject = { message: "Hello, JSON Safety!", numberValue: 123 };
          const serialized = safeJsonStringify(testObject);
          const deserialized = safeJsonParse(serialized);
          setTestData(JSON.stringify(deserialized));

        } catch (err) {
          setError('Error processing ZIP file: ' + (err as Error).message);
        }
      }
    },
    []
  );

  const { dndProps } = useDrop({
    onDrop: handleDrop,
  });

  return (
    <div>
      <div {...dndProps} className="border-dashed border-2 border-gray-300 p-4 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Drag and drop a ZIP file here</p>
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {categories.length > 0 && (
        <div>
          <h2>Categories</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Test Data Display */}
      {testData && (
        <div>
          <h2>JSON Safety Test</h2>
          <pre>{testData}</pre>
        </div>
      )}
    </div>
  );
}

export default ZipImporter;

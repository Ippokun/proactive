import React, { useState } from "react";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void; // Callback to pass files to parent
  multiple?: boolean; // Allow multiple files
  accept?: string; // File types (e.g., "image/*")
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  multiple = true,
  accept = "*",
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");

  const MAX_FILE_SIZE_MB = 100; // Maximum file size in MB
  const FILE_LIMIT = 3; // Maximum number of files

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(""); // Clear previous error
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalFiles = selectedFiles.length + files.length;

      // Validate number of files
      if (totalFiles > FILE_LIMIT) {
        setError(`Зөвхөн ${FILE_LIMIT} файл сонгох боломжтой.`);
        return;
      }

      // Validate file size
      const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
      if (oversizedFile) {
        setError(`Файлын хэмжээ 100MB-с хэтэрсэн байна: ${oversizedFile.name}`);
        return;
      }

      // Update selected files
      const newFiles = [...selectedFiles, ...files];
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1); // Remove file by index
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles); // Pass updated files to parent
  };

  return (
    <div className="file-upload">
      <label className="block border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition">
        <input
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={handleFileChange}
        />
        <div className="flex items-center justify-center text-gray-700">
          <span className="text-sm font-medium">📁 Файл сонгох</span>
        </div>
      </label>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      {selectedFiles.length > 0 && (
        <ul className="mt-2 pl-5 text-gray-600 space-y-1">
          {selectedFiles.map((file, index) => (
            <li
              key={index}
              className="text-sm flex justify-between items-center marker:text-blue-500 marker:text-lg"
            >
              {file.name}
              <button
                className="ml-2 text-red-500 hover:text-red-700 text-sm"
                onClick={() => handleRemoveFile(index)}
              >
                Устгах
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;

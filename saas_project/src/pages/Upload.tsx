import { useState } from "react";

export default function Upload() {
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    healthInfo: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TEMP: Just save in local state
    console.log("Patient form:", formData, file);
    setSubmitted(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Patient Form Upload</h1>
      {submitted ? (
        <p className="text-green-600">Form submitted successfully!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="border p-2"
          />
          <input
            type="date"
            placeholder="Birthday"
            value={formData.birthday}
            onChange={(e) =>
              setFormData({ ...formData, birthday: e.target.value })
            }
            className="border p-2"
          />
          <textarea
            placeholder="Health Info"
            value={formData.healthInfo}
            onChange={(e) =>
              setFormData({ ...formData, healthInfo: e.target.value })
            }
            className="border p-2"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button type="submit" className="bg-green-500 text-white p-2">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

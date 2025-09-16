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
    console.log("Patient form:", formData, file);
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h1 className="text-xl font-bold mb-4">Patient Form Upload</h1>
      {submitted ? (
        <p className="text-green-600 font-semibold">
          ✅ Form submitted successfully!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="border p-2 rounded-md"
          />
          <input
            type="date"
            value={formData.birthday}
            onChange={(e) =>
              setFormData({ ...formData, birthday: e.target.value })
            }
            className="border p-2 rounded-md"
          />
          <textarea
            placeholder="Health Info"
            value={formData.healthInfo}
            onChange={(e) =>
              setFormData({ ...formData, healthInfo: e.target.value })
            }
            className="border p-2 rounded-md"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border p-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function formatLabel(field) {
  return field.replaceAll("_", " ");
}

function inputType(field) {
  if (field.toLowerCase().includes("date")) return "date";
  if (
    field.toLowerCase().includes("quantity") ||
    field.toLowerCase().includes("id")
  ) return "number";
  return "text";
}

function formatDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export default function ResourceClient({ resource, rows, fields }) {
  const router = useRouter();

  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function resetForm() {
    setFormData({});
    setEditingId(null);
  }

  function startEdit(row) {
    const idField = Object.keys(row).find(
      (key) => key.toLowerCase().endsWith("_id")
    );

    setEditingId(row[idField]);

    const values = {};
    fields.forEach((field) => {
      let value = row[field];

      if (inputType(field) === "date") {
        value = formatDate(value);
      } else if (value === null || value === undefined) {
        value = "";
      } else {
        value = String(value);
      }

      values[field] = value;
    });

    setFormData(values);
    setMessage("");
    setError("");
  }

  async function submitForm(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const payload = {};

      fields.forEach((field) => {
        const value = formData[field];

        if (value !== "" && value !== undefined) {
          payload[field] =
            inputType(field) === "number" ? Number(value) : value;
        }
      });

      const url = editingId !== null
        ? `/api/${resource}/${editingId}`
        : `/api/${resource}`;

      const response = await fetch(url, {
        method: editingId !== null ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Operation failed.");
      }

      setMessage(
        editingId !== null
          ? "Record updated successfully."
          : "Record created successfully."
      );

      resetForm();
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteRecord(id) {
    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/${resource}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Delete failed.");
      }

      setMessage("Record deleted successfully.");
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <>
      <section className="card">
        <h2>{editingId !== null ? "Edit record" : "Add a record"}</h2>

        <form onSubmit={submitForm}>
          <div className="formgrid">
            {fields.map((field) => (
              <label key={field}>
                {formatLabel(field)}
                <input
                  type={inputType(field)}
                  value={formData[field] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field]: e.target.value,
                    })
                  }
                  required={[
                    "Name",
                    "Organization_Name",
                    "Food_Name",
                    "donor_id",
                    "batch_id",
                    "recipient_id",
                    "request_id",
                    "Quantity",
                    "Requested_Quantity",
                    "Distributed_Quantity",
                    "Expiry_Date",
                    "Request_Date",
                    "Distribution_Date",
                  ].includes(field)}
                  min={inputType(field) === "number" ? 0 : undefined}
                />
              </label>
            ))}
          </div>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <button disabled={busy}>
            {busy
              ? "Saving..."
              : editingId !== null
              ? "Update record"
              : "Create record"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="secondary"
              style={{ marginLeft: 10 }}
              onClick={resetForm}
            >
              Cancel edit
            </button>
          )}
        </form>
      </section>

      <section className="tablewrap">
        {rows.length === 0 ? (
          <p>No records yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                {Object.keys(rows[0]).map((key) => (
                  <th key={key}>{formatLabel(key)}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const idField = Object.keys(row).find(
                  (key) => key.toLowerCase().endsWith("_id")
                );
                const id = row[idField];

                return (
                  <tr key={id}>
                    {Object.values(row).map((value, index) => (
                      <td key={index}>
                        {value === null ? "—" : String(value)}
                      </td>
                    ))}

                    <td>
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => startEdit(row)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="danger"
                        style={{ marginLeft: 6 }}
                        onClick={() => deleteRecord(id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

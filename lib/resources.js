export const resources = {
  donors: {
    table: "DONOR", id: "donor_id",
    fields: ["Name", "Donor_Type", "Contact_Person", "Phone_No", "Email", "Street", "City", "State", "Country"],
    required: ["Name"]
  },
  recipients: {
    table: "RECIPIENT_ORGANIZATION", id: "recipient_id",
    fields: ["Organization_Name", "Organization_Type", "Contact_Person", "Phone_No", "Email", "Street", "City", "State", "Country"],
    required: ["Organization_Name"]
  },
  batches: {
    table: "FOOD_BATCH", id: "batch_id",
    fields: ["donor_id", "Food_Name", "Food_Category", "Quantity", "Unit", "Condition_Status", "Production_Date", "Expiry_Date", "Batch_Status"],
    required: ["donor_id", "Food_Name", "Quantity", "Expiry_Date"]
  },
  requests: {
    table: "COLLECTION_REQUEST", id: "request_id",
    fields: ["batch_id", "recipient_id", "Requested_Quantity", "Request_Date", "Preferred_Pickup_Time", "Request_Status", "Notes"],
    required: ["batch_id", "recipient_id", "Requested_Quantity", "Request_Date"]
  },
  transportation: {
    table: "TRANSPORTATION", id: "transport_id",
    fields: ["request_id", "Driver_Name", "Vehicle_Number", "Pickup_Time", "Delivery_Time", "Transport_Status"],
    required: ["request_id"]
  },
  distributions: {
    table: "DISTRIBUTION", id: "distribution_id",
    fields: ["request_id", "recipient_id", "Distributed_Quantity", "Distribution_Date", "Distribution_Status", "Received_By"],
    required: ["request_id", "recipient_id", "Distributed_Quantity", "Distribution_Date"]
  }
};

export function pickFields(input, config, partial = false) {
  const output = {};
  for (const field of config.fields) {
    if (Object.prototype.hasOwnProperty.call(input, field)) output[field] = input[field];
  }
  if (!partial) {
    for (const field of config.required) {
      if (output[field] === undefined || output[field] === null || output[field] === "") {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }
  if (Object.keys(output).length === 0) throw new Error("No permitted fields supplied.");
  return output;
}

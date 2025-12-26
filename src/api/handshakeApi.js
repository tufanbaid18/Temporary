import api from "./api";

// -----------------------------------------
// CREATE HANDSHAKE  (POST /handshake)
// -----------------------------------------
export const createHandshake = async ({ receiver_id }) => {
  const res = await api.post("/handshake/send/", { receiver_id });
  return res.data;
};

// -----------------------------------------
// UPDATE HANDSHAKE STATUS (PUT /handshake/:id)
// -----------------------------------------
export const updateHandshakeStatus = async (id, status) => {
  const res = await api.put(`/handshake/${id}`, { status });
  return res.data;
};

// -----------------------------------------
// GET HANDSHAKE BY ID
// -----------------------------------------
// export const getHandshakeById = async (id) => {
//   const res = await api.get(`/handshake/${id}`);
//   return res.data;
// };


// export const getMyHandshakes = async () => {
//   const res = await api.get(`/handshake/my-handshakes`);
//   return res.data.handshakes;
// };

// -----------------------------------------
// GET ALL HANDSHAKES FOR A USER
// -----------------------------------------
export const getHandshakesForUser = async (userId) => {
  const res = await api.get(`/handshake/${userId}`);
  return res.data;
};


// ----------------------------------------------------
// ACCEPT HANDSHAKE (POST /handshake/:id/accept/)
// ----------------------------------------------------
export const acceptHandshake = async (id) => {
  const res = await api.post(`/handshake/${id}/accept/`);
  return res.data;
};

// ----------------------------------------------------
// DECLINE HANDSHAKE (POST /handshake/:id/decline/)
// ----------------------------------------------------
export const declineHandshake = async (id) => {
  const res = await api.post(`/handshake/${id}/decline/`);
  return res.data;
};

// ----------------------------------------------------
// CANCEL HANDSHAKE (POST /handshake/:id/cancel/)
// ----------------------------------------------------
export const cancelHandshake = async (id) => {
  const res = await api.post(`/handshake/${id}/cancel/`);
  return res.data;
};

// ----------------------------------------------------
// MY HANDSHAKES (GET /handshake/my_handshakes/)
// ----------------------------------------------------
export const getMyHandshakes = async () => {
  const res = await api.get("/handshake/my_handshakes/");
  // your backend returns { sent: [...], received: [...] } — return merged array for frontend convenience
  const payload = res.data || {};
  const sent = payload.sent || [];
  const received = payload.received || [];
  // combine and add a direction flag to each item
  const combined = [
    ...sent.map((h) => ({ ...h, direction: "sent" })),
    ...received.map((h) => ({ ...h, direction: "received" })),
  ];
  // sort by created_at desc
  combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return combined;
};

// ----------------------------------------------------
// GET HANDSHAKE BY ID (GET /handshake/:id/)
// ----------------------------------------------------
export const getHandshakeById = async (id) => {
  const res = await api.get(`/handshake/${id}/`);
  return res.data;
};

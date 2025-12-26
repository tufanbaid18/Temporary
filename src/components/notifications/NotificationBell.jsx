import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onChildAdded, remove, update } from "firebase/database";
import { useQueryClient } from "@tanstack/react-query";
import {
  useNotifications,
  useMarkRead,
  useMarkAllRead,
  useDeleteNotification,
  useClearAllNotifications,
} from "../../hooks/notifications/useNotifications";

/* ------------------------------------
   Firebase Config
------------------------------------ */
const firebaseConfig = {
  apiKey: "AIzaSyDOyxNCEw28eOW26gm-wvyXXAvCjCNboCU",
  authDomain: "notification-myneuron.firebaseapp.com",
  databaseURL: "https://notification-myneuron-default-rtdb.firebaseio.com",
  projectId: "notification-myneuron",
  storageBucket: "notification-myneuron.appspot.com",
  messagingSenderId: "939658171334",
  appId: "1:939658171334:web:596e2ae978b5c77536d8c7",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ------------------------------------
   Notification Bell
------------------------------------ */
export default function NotificationBell() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  /* Backend hooks */
  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const deleteNotif = useDeleteNotification();
  const clearAll = useClearAllNotifications();
  const queryClient = useQueryClient();
  /* Firebase state */
  // const [firebaseNotifs, setFirebaseNotifs] = useState([]);
  const [open, setOpen] = useState(false);

  /* ------------------------------------
     Firebase real-time listener
  ------------------------------------ */
  // useEffect(() => {
  //   if (!userId) return;

  //   const notifRef = ref(db, `notifications/${userId}`);

  //   const unsubscribe = onChildAdded(notifRef, (snapshot) => {
  //     const data = snapshot.val();

  //     setFirebaseNotifs((prev) => [
  //       {
  //         firebaseKey: snapshot.key,   // ⭐ REQUIRED
  //         id: snapshot.key,
  //         actor_name: data.actor_name,
  //         action: data.action,
  //         created_at: data.created_at,
  //         is_read: data.is_read ?? false,
  //         is_firebase: true,
  //       },
  //       ...prev,
  //     ]);
  //   });

  //   return () => unsubscribe();
  // }, [userId]);


  useEffect(() => {
    if (!userId) return;

    const notifRef = ref(db, `notifications/${userId}`);

    const unsubscribe = onChildAdded(notifRef, () => {
      // 🔥 Firebase is ONLY a trigger
      queryClient.invalidateQueries(["notifications"]);
    });

    return () => unsubscribe();
  }, [userId, queryClient]);

  /* ------------------------------------
     Merge notifications
  ------------------------------------ */
  // const notifications = [...firebaseNotifs, ...apiNotifs];

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  /* ------------------------------------
     Actions
  ------------------------------------ */

  const handleMarkRead = (notif) => {
    if (notif.is_firebase) {
      const notifRef = ref(db, `notifications/${userId}/${notif.firebaseKey}`);
      update(notifRef, { is_read: true });

      setFirebaseNotifs((prev) =>
        prev.map((n) =>
          n.id === notif.id ? { ...n, is_read: true } : n
        )
      );
    } else {
      markRead.mutate(notif.id);
    }
  };


  /* ---------------------------------- */
  /* ❌ Delete Single */
  /* ---------------------------------- */
  const handleDelete = (notif) => {
    if (notif.is_firebase) {
      remove(ref(db, `notifications/${userId}/${notif.firebaseKey}`));
      setFirebaseNotifs((prev) =>
        prev.filter((n) => n.firebaseKey !== notif.firebaseKey)
      );
    } else {
      deleteNotif.mutate(notif.id);
    }
  };


  const handleMarkAllRead = async () => {
    // Backend
    markAllRead.mutate();

    // Firebase
    const updates = {};
    firebaseNotifs.forEach((n) => {
      updates[`notifications/${userId}/${n.firebaseKey}/is_read`] = true;
    });

    await update(ref(db), updates);

    // Local state
    setFirebaseNotifs((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
  };

  /* ---------------------------------- */
  /* 🧹 Clear All */
  /* ---------------------------------- */
  const handleClearAll = () => {
    clearAll.mutate();
    remove(ref(db, `notifications/${userId}`)); // 🔥 CRITICAL FIX
    setFirebaseNotifs([]);
  };

  /* ------------------------------------
     UI
  ------------------------------------ */
  return (
    <div style={{ position: "relative" }}>
      <button className="btn btn-light position-relative" onClick={() => setOpen(!open)}>
        <i className="ri-notification-3-line fs-4"></i>
        {unreadCount > 0 && (
          <span className="badge bg-danger position-absolute top-0 end-0">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="shadow"
          style={{
            position: "absolute",
            right: 0,
            top: "45px",
            width: "330px",
            background: "#fff",
            borderRadius: "8px",
            zIndex: 100,
          }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between p-3 border-bottom">
            <strong>Notifications</strong>
            <button className="btn btn-sm btn-outline-secondary" onClick={handleMarkAllRead}>
              Mark all read
            </button>
          </div>

          {/* Body */}
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {notifications.length === 0 && (
              <div className="text-center p-3 text-muted">No notifications</div>
            )}

            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border-bottom d-flex justify-content-between ${!n.is_read ? "bg-light" : ""
                  }`}
              >
                <div
                // onClick={() => handleMarkRead(n)} style={{ cursor: "pointer" }}
                >
                  <div className="fw-semibold">
                    {n.actor_name || n.actor_details?.name}
                  </div>
                  <div className="small text-muted">{n.action}</div>
                </div>

                <i
                  className="ri-delete-bin-line text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(n)}
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-2 border-top">
            <button className="btn btn-danger btn-sm w-100" onClick={handleClearAll}>
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

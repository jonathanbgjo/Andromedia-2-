import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import styles from "./Profile.module.css";

interface UserProfile {
  id: number;
  displayName: string;
  email: string;
  createdDate: string;
  videoCount: number;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<UserProfile>("/api/users/me", { auth: true })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, []);

  const handleEdit = () => {
    if (profile) {
      setEditName(profile.displayName);
      setEditing(true);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditName("");
  };

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const updated = await api<UserProfile>("/api/users/me", {
        method: "PUT",
        body: { displayName: editName.trim() },
        auth: true,
      });
      setProfile(updated);
      setEditing(false);
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Your Profile</h1>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Your Profile</h1>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Your Profile</h1>
        <div className={styles.error}>Profile not found</div>
      </div>
    );
  }

  const initial = profile.displayName?.charAt(0)?.toUpperCase() || "?";
  const joinDate = profile.createdDate
    ? new Date(profile.createdDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Your Profile</h1>

      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.profileInfo}>
            <h2 className={styles.displayName}>{profile.displayName}</h2>
            <p className={styles.email}>{profile.email}</p>
            <p className={styles.joinDate}>Joined {joinDate}</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{profile.videoCount}</span>
            <span className={styles.statLabel}>
              Video{profile.videoCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={handleEdit}>
            Edit Profile
          </button>
          <Link to={`/channel/${profile.id}`} className={styles.channelLink}>
            Your Channel
          </Link>
        </div>

        {editing && (
          <div className={styles.editForm}>
            <div className={styles.editField}>
              <label className={styles.editLabel} htmlFor="displayName">
                Display Name
              </label>
              <input
                id="displayName"
                className={styles.editInput}
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter display name"
              />
            </div>
            <div className={styles.editActions}>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={saving || !editName.trim()}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button className={styles.cancelBtn} onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  UsersRound,
  BriefcaseBusiness,
  UserPlus,
  X,
  Mail,
  ShieldCheck,
  LockKeyhole,
  User,
} from "lucide-react";

import { useUsers } from "../context/UsersContext";
import { useLeads } from "../context/LeadsContext";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

export default function Team() {
  const { users, loading } = useUsers();
  const { leads } = useLeads();
  const { user } = useAuth();

  const [showAddMember, setShowAddMember] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");

  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function openAddMember() {
    setShowAddMember(true);
    setMessage("");
    setError("");
  }

  function closeAddMember() {
    if (creating) return;

    setShowAddMember(false);
    setMessage("");
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setRole("staff");
  }

  async function handleCreateMember(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError("Member name is required.");
      return;
    }

    if (!cleanEmail) {
      setError("Member email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setCreating(true);

      const response = await client.post("/users", {
        name: cleanName,
        email: cleanEmail,
        password,
        role,
      });

      setMessage(
        response.data?.message || "Member created successfully."
      );

      setName("");
      setEmail("");
      setPassword("");
      setRole("staff");
    } catch (err) {
      console.error("Create member error:", err);

      setError(
        err.response?.data?.message ||
          "Member could not be created. Please try again."
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <div className="workspace-page">
        <header className="page-header">
          <div>
            <div className="breadcrumb">Manage / Team</div>

            <h1>Team</h1>

            <p>
              See ownership and active workload without leaving the workspace.
            </p>
          </div>

          {/* Add Member is visible only to Admin */}
          {user?.role === "admin" && (
            <button
              type="button"
              className="primary-button"
              onClick={openAddMember}
            >
              <UserPlus size={17} />
              Add Member
            </button>
          )}
        </header>

        {loading ? (
          <div className="empty-state">Loading team…</div>
        ) : (
          <div className="team-grid">
            {users.map((u) => {
              const assigned = leads.filter(
                (l) => l.assignedToId === u.id
              );

              return (
                <article className="team-card" key={u.id}>
                  <div className="team-top">
                    <div className="avatar avatar-lg">
                      {u.name?.[0]?.toUpperCase() || "?"}
                    </div>

                    <div>
                      <h2>{u.name}</h2>
                      <p>{u.email}</p>
                    </div>

                    <span className="role-chip">{u.role}</span>
                  </div>

                  <div className="team-metrics">
                    <div>
                      <strong>{assigned.length}</strong>
                      <span>cards assigned</span>
                    </div>

                    <div>
                      <strong>
                        {
                          assigned.filter(
                            (l) => l.stage === "Won"
                          ).length
                        }
                      </strong>
                      <span>won</span>
                    </div>
                  </div>

                  <div className="team-work">
                    <BriefcaseBusiness size={14} />

                    <span>
                      {assigned
                        .slice(0, 3)
                        .map((l) => l.name)
                        .join(" · ") || "No assigned cards"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {users.length === 0 && !loading && (
          <div className="empty-state">
            <UsersRound size={20} />
            No team members returned by the existing API.
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMember && user?.role === "admin" && (
        <div
          className="invite-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeAddMember();
            }
          }}
        >
          <div className="invite-modal">
            <div className="invite-modal-header">
              <div className="invite-title-area">
                <div className="invite-icon">
                  <UserPlus size={18} />
                </div>

                <div>
                  <h2>Add Member</h2>

                  <p>
                    Create a new member account for your CRM workspace.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="invite-close"
                onClick={closeAddMember}
                disabled={creating}
                aria-label="Close add member"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="invite-form"
              onSubmit={handleCreateMember}
            >
              <div className="invite-field">
                <label htmlFor="member-name">
                  Member Name
                </label>

                <div className="invite-input-wrapper">
                  <User size={16} />

                  <input
                    id="member-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={creating}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="invite-field">
                <label htmlFor="member-email">
                  Email
                </label>

                <div className="invite-input-wrapper">
                  <Mail size={16} />

                  <input
                    id="member-email"
                    type="email"
                    placeholder="employee@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={creating}
                    required
                  />
                </div>

                <span className="invite-help">
                  This email will be used to log in.
                </span>
              </div>

              <div className="invite-field">
                <label htmlFor="member-password">
                  Password
                </label>

                <div className="invite-input-wrapper">
                  <LockKeyhole size={16} />

                  <input
                    id="member-password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={creating}
                    minLength={6}
                    required
                  />
                </div>

                <span className="invite-help">
                  Minimum 6 characters.
                </span>
              </div>

              <div className="invite-field">
                <label htmlFor="member-role">
                  Role
                </label>

                <div className="invite-role-wrapper">
                  <ShieldCheck size={16} />

                  <select
                    id="member-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={creating}
                  >
                    <option value="staff">Staff</option>
                  </select>
                </div>
              </div>

              {message && (
                <div className="invite-message invite-success">
                  <ShieldCheck size={15} />
                  <span>{message}</span>
                </div>
              )}

              {error && (
                <div className="invite-message invite-error">
                  <X size={15} />
                  <span>{error}</span>
                </div>
              )}

              <div className="invite-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeAddMember}
                  disabled={creating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={creating}
                >
                  <UserPlus size={16} />

                  {creating
                    ? "Creating..."
                    : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
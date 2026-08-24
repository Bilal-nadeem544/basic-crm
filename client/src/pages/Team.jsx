import { useState } from "react";
import {
  UsersRound,
  BriefcaseBusiness,
  UserPlus,
  X,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useUsers } from "../context/UsersContext";
import { useLeads } from "../context/LeadsContext";
import client from "../api/client";

export default function Team() {
  const { users, loading } = useUsers();
  const { leads } = useLeads();

  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function openInvite() {
    setShowInvite(true);
    setMessage("");
    setError("");
  }

  function closeInvite() {
    if (sending) return;

    setShowInvite(false);
    setMessage("");
    setError("");
    setEmail("");
    setRole("staff");
  }

  async function handleInvite(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Employee email is required.");
      return;
    }

    try {
      setSending(true);

      const response = await client.post("/invites", {
        email: cleanEmail,
        role,
      });

      setMessage(
        response.data?.message || "Invitation sent successfully."
      );

      setEmail("");
      setRole("staff");
    } catch (err) {
      console.error("Invite employee error:", err);

      setError(
        err.response?.data?.message ||
          "Invitation could not be sent. Please try again."
      );
    } finally {
      setSending(false);
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

          <button
            type="button"
            className="primary-button"
            onClick={openInvite}
          >
            <UserPlus size={17} />
            Invite Employee
          </button>
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

      {/* Invite Employee Modal */}
      {showInvite && (
        <div
          className="invite-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeInvite();
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
                  <h2>Invite Employee</h2>
                  <p>
                    Add a new member to your CRM workspace.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="invite-close"
                onClick={closeInvite}
                disabled={sending}
                aria-label="Close invitation"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="invite-form"
              onSubmit={handleInvite}
            >
              <div className="invite-field">
                <label htmlFor="invite-email">
                  Employee Email
                </label>

                <div className="invite-input-wrapper">
                  <Mail size={16} />

                  <input
                    id="invite-email"
                    type="email"
                    placeholder="employee@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={sending}
                    autoFocus
                    required
                  />
                </div>

                <span className="invite-help">
                  An invitation link will be sent to this email address.
                </span>
              </div>

              <div className="invite-field">
                <label htmlFor="invite-role">
                  Role
                </label>

                <div className="invite-role-wrapper">
                  <ShieldCheck size={16} />

                  <select
                    id="invite-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={sending}
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
                  onClick={closeInvite}
                  disabled={sending}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={sending}
                >
                  <UserPlus size={16} />

                  {sending
                    ? "Sending..."
                    : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
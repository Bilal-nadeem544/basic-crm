import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail({ email, token, role }) {
  const acceptUrl = `${process.env.CLIENT_URL}/accept-invite?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "CRM <onboarding@resend.dev>",
    to: [email],
    subject: "You're invited to join CRM",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>You're invited to join our CRM</h2>

        <p>You have been invited as a <strong>${role}</strong>.</p>

        <p>Click the button below to accept your invitation and set your password.</p>

        <a
          href="${acceptUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Accept Invitation
        </a>

        <p style="margin-top: 20px;">
          This invitation will expire in 24 hours.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
import { OAuth2Client } from "google-auth-library";
import { client_id } from "../../../Config/config.service.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleVerification = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: client_id,
  });

  const payload = ticket.getPayload();
  return {
    email: payload.email,
    username: payload.given_name+" "+payload.family_name,
  };
};

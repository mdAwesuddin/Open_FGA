import { OpenFgaClient, CredentialsMethod } from "@openfga/sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize FGA client with client credentials
const fgaClient = new OpenFgaClient({
  apiUrl: process.env.OPENFGA_API_URL,
  storeId: process.env.OPENFGA_STORE_ID,
  authorizationModelId: process.env.OPENFGA_MODEL_ID,
  credentials: {
    method: CredentialsMethod.ClientCredentials,
    config: {
      apiTokenIssuer: process.env.OPENFGA_API_ISSUER,
      apiAudience: process.env.OPENFGA_API_AUDIENCE,
      clientId: process.env.OPENFGA_CLIENT_ID,
      clientSecret: process.env.OPENFGA_CLIENT_SECRET,
    },
  },
});

/**
 * Check all roles defined for a user
 */
export async function getUserRoles(userId) {
  const roles = [];
  const roleChecks = [
    { relation: "admin", object: "dashboard:main" },
    { relation: "viewer", object: "dashboard:main" },
  ];

  for (const { relation, object } of roleChecks) {
    const { allowed } = await fgaClient.check({
      user: `user:${userId}`,
      relation,
      object,
    });

    if (allowed) roles.push(relation);
  }

  return roles;
}

/**
 * Generic permission check
 */
export async function checkPermission(userId, relation, object) {
  const { allowed } = await fgaClient.check({
    user: `user:${userId}`,
    relation,
    object,
  });

  return allowed;
}

/**
 * Specific check for dashboard access
 */
export async function checkDashboardAccess(userId) {
  return checkPermission(userId, "can_access", "dashboard:main");
}

import { OpenFgaClient, CredentialsMethod } from "@openfga/sdk";
import dotenv from "dotenv";

dotenv.config();

// ✅ Initialize FGA client with OAuth2 Client Credentials
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
 * ✅ Get all roles of a user
 */
export async function getUserRoles(userId) {
  try {
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

    return roles.length > 0 ? roles : ["no-role"];
  } catch (err) {
    console.error("❌ Error in getUserRoles:", err.message);
    throw new Error("Failed to fetch user roles");
  }
}

/**
 * ✅ Generic permission check
 */
export async function checkPermission(userId, relation, object) {
  try {
    const { allowed } = await fgaClient.check({
      user: `user:${userId}`,
      relation,
      object,
    });
    return allowed;
  } catch (err) {
    console.error("❌ Error in checkPermission:", err.message);
    throw new Error("Failed to check permission");
  }
}

/**
 * ✅ Specific check for dashboard access
 */
export async function checkDashboardAccess(userId) {
  return checkPermission(userId, "can_access", "dashboard:main");
}

/**
 * ✅ Assign role (admin/viewer) to user
 */
export async function assignRole(userId, role) {
  const object = "dashboard:main";
  const alreadyHasRole = await checkPermission(userId, role, object);

  if (alreadyHasRole) {
    return { message: `User ${userId} already has role ${role}` };
  }

  try {
    await fgaClient.write({
      writes: [
        {
          user: `user:${userId}`,
          relation: role, // "admin" or "viewer"
          object,
        },
      ],
    });

    return { message: `✅ Role ${role} assigned to ${userId}` };
  } catch (err) {
    console.error("❌ Error in assignRole:", err.message);
    throw new Error("Failed to assign role");
  }
}


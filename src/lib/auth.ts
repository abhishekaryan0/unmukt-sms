import { UserSession, Customer } from "@/types";

const ADMIN_STORAGE_KEY = "smsunmukt_admin_session";
const CLIENT_STORAGE_KEY = "smsunmukt_client_session";
const IMPERSONATION_KEY = "smsunmukt_impersonation";

export const DEMO_ADMIN = {
  email: "admin@messagehub.in",
  password: "Admin@123",
  user: {
    id: "admin-01",
    email: "admin@messagehub.in",
    name: "Vikram Malhotra",
    role: "super_admin" as const,
    businessName: "SMS Unmukt Platform",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  },
};

export const DEMO_CLIENT = {
  email: "demo@messagehub.in",
  password: "Demo@123",
  user: {
    id: "cust-01",
    email: "demo@messagehub.in",
    name: "Rajesh Sharma",
    role: "client" as const,
    businessName: "Sharma Fashion Store",
    category: "Retail & Apparel",
    phone: "+91 98112 34567",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
};

export function getAdminSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(ADMIN_STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function getClientSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(CLIENT_STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function loginAdmin(email: string, pass: string): { success: boolean; error?: string; session?: UserSession } {
  if (email.trim().toLowerCase() === DEMO_ADMIN.email.toLowerCase() && pass === DEMO_ADMIN.password) {
    const session: UserSession = {
      ...DEMO_ADMIN.user,
      token: "demo_admin_jwt_" + Date.now(),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
    }
    return { success: true, session };
  }
  return { success: false, error: "Invalid admin email or password. Use demo credentials." };
}

export function loginClient(email: string, pass: string): { success: boolean; error?: string; session?: UserSession } {
  if (email.trim().toLowerCase() === DEMO_CLIENT.email.toLowerCase() && pass === DEMO_CLIENT.password) {
    const session: UserSession = {
      ...DEMO_CLIENT.user,
      token: "demo_client_jwt_" + Date.now(),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(session));
      localStorage.removeItem(IMPERSONATION_KEY);
    }
    return { success: true, session };
  }
  return { success: false, error: "Invalid client email or password. Use demo credentials." };
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
}

export function logoutClient(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CLIENT_STORAGE_KEY);
    localStorage.removeItem(IMPERSONATION_KEY);
  }
}

/**
 * Super Admin Impersonation:
 * Allows the platform administrator to log in as any customer account to troubleshoot or manage on their behalf.
 */
export function impersonateCustomer(customer: Customer): UserSession {
  const session: UserSession = {
    id: customer.id,
    email: customer.email,
    name: customer.ownerName,
    role: "client",
    businessName: customer.businessName,
    category: customer.businessCategory,
    phone: customer.mobile,
    token: `impersonated_${customer.id}_${Date.now()}`,
    isImpersonated: true,
    impersonatedBy: "Vikram Malhotra (Super Admin)",
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem(
      IMPERSONATION_KEY,
      JSON.stringify({
        active: true,
        customerId: customer.id,
        customerName: customer.businessName,
        adminName: "Vikram Malhotra",
      })
    );
  }

  return session;
}

export function stopImpersonation(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(IMPERSONATION_KEY);
    // Reset to default client demo session
    const defaultSession: UserSession = {
      ...DEMO_CLIENT.user,
      token: "demo_client_jwt_" + Date.now(),
    };
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(defaultSession));
  }
}

export function getImpersonationState(): {
  active: boolean;
  customerId?: string;
  customerName?: string;
  adminName?: string;
} {
  if (typeof window === "undefined") return { active: false };
  try {
    const item = localStorage.getItem(IMPERSONATION_KEY);
    return item ? JSON.parse(item) : { active: false };
  } catch {
    return { active: false };
  }
}

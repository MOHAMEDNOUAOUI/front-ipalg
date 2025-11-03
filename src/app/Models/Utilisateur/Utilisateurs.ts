import { Profile } from './Profile';

export enum statusUtilisateur {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Locked = 'LOCKED',
  Pending = 'PENDING',
}
export enum sourceUtilisateur {
  LDAP = 'LDAP',
  Manual = 'Manual',
  Keycloak = 'Keycloak',
}
export interface Utilisateur {
  id?: string; // Internal system ID
  keycloakId?: string; // ID from Keycloak ('sub' field or user UUID)
  username?: string; // sAMAccountName in LDAP (or Keycloak username)
  email?: string; // mail in LDAP
  phone?: string; // Optional; not always in LDAP
  firstName?: string; // LDAP: cn
  lastName?: string; // LDAP: sn
  status?: statusUtilisateur; // Aligns with Keycloak 'enabled' and LDAP account state
  profile?: Profile; // Application-specific role/profile
  roles?: string[]; // From Keycloak groups or roles
  groups?: string[]; // Optional: LDAP groups / Keycloak groups
  createdBy?: string; // Who created the user in your system
  dateDeModification?: Date;
  dateCreation?: Date;
  dateUpdate?: Date;
  lastLogin?: Date; // Last local change
  createdAt?: Date; // When created (in your system)
  source?: sourceUtilisateur;
  userProfile?: UtilisateurProfile;
  permissionsCount?: number; // Helps trace origin of user
}

export interface UtilisateurProfile {
  id: string;
  name: string;
  description: string;
}

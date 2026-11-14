import type { Language } from "../hooks/useLanguage";

const EN = {
  // Common
  "common.cancel": "Cancel",
  "common.you": "(You)",

  // Language
  "language.switchTo": "Switch to {name}",

  // Theme
  "theme.system": "System theme",
  "theme.light": "Light theme",
  "theme.dark": "Dark theme",
  "theme.name.system": "system",
  "theme.name.light": "light",
  "theme.name.dark": "dark",
  "theme.switchTo": "{label} (switch to {next})",

  // Header
  "header.guest": "Guest {id}",
  "header.superuser": "SuperUser",

  // Login / Link
  "auth.login": "Log In",
  "auth.linkAccount": "Link Account",
  "auth.loginTitle": "Log in to your account",
  "auth.linkTitle": "Link a new account",
  "auth.loginDescription": "Choose an account from any of the providers below for starters, then link another profile later",
  "auth.linkDescription": "Connect another profile from any of the providers below to your account for more login flexibility",
  "auth.continueWithGoogle": "Continue with Google",
  "auth.continueWithFacebook": "Continue with Facebook",

  // Logout
  "auth.logout": "Log Out",
  "auth.logoutTitle": "Log out of your account",
  "auth.logoutConfirm": "Are you sure you want to log out?",
  "auth.loggingOut": "Logging out...",

  // Consent
  "consent.title": "Create New Account",
  "consent.description": "We are not able to find an existing account linked to this profile",
  "consent.details": "You can cancel this process, log in to your existing account if there are any, and link this profile, OR proceed to get started with a new account",
  "consent.creating": "Creating...",
  "consent.create": "Create Account",

  // Account activation / deletion
  "account.cancelDeletion": "Cancel Deletion",
  "account.activate": "Activate Account",
  "account.cancelDeletionTitle": "Cancel account deletion",
  "account.reactivateTitle": "Reactivate your account",
  "account.pendingDeletionDescription": "Your account is scheduled for permanent deletion. Cancel the process to keep your account",
  "account.disabledDescription": "Your account is currently disabled. Activate it to resume full feature access",
  "account.deactivate": "Deactivate Account",
  "account.deactivateTitle": "Deactivate your account",
  "account.deactivateDescription": "Your account will temporarily be disabled. Reactivate it at any time for full feature access",
  "account.delete": "Delete Account",
  "account.deleteTitle": "Delete your account",
  "account.deleteDescription": "Your account will be permanently queued for deletion. Reactivate it to prevent permanent deletion",
  "account.processing": "Processing...",
  "account.deleteAll": "Delete All Accounts",

  // Toasts
  "toast.loginSuccess": "You are successfully logged in",
  "toast.signupSuccess": "Your account has been created",
  "toast.linkSuccess": "Your accounts are now linked",
  "toast.linkError": "Account already linked to another user",
  "toast.providerSuccess": "Your account is already linked to this user",
  "toast.providerError": "You can't link accounts from the same provider",
  "toast.authError": "Authentication failed",
  "toast.genericError": "Something went wrong",
  "toast.loggedOut": "You have been logged out",
  "toast.allDeletionsProcessed": "All scheduled account deletions have been processed",
  "toast.deletionScheduled": "Your account has been scheduled for deletion",
  "toast.deactivated": "Your account has been deactivated",
  "toast.reactivated": "Your account has been reactivated",

  // AI chat
  "chat.welcome": "Hello, what do you have in mind?",
  "chat.placeholder": "Ask me anything...",
  "chat.send": "Send message",

  // Code blocks
  "code.defaultLabel": "code",
  "code.copied": "Copied to clipboard",
  "code.copy": "Copy code",
  "code.download": "Download snippet",

  // Rooms menu
  "rooms.create": "Create New Room",
  "rooms.active": "Active Rooms",
  "rooms.loading": "Loading rooms...",
  "rooms.empty": "No rooms available",
  "rooms.delete": "Delete Room",
  "rooms.deleteConfirm": "Are you sure you want to permanently delete this room?",

  // Room chat
  "roomChat.title": "Room Chat",
  "roomChat.placeholder": "Type message...",
  "roomChat.send": "Send",

  // Presence card
  "presence.participants": "Online Participants ({count})",
  "presence.host": "Host",
  "presence.grantControl": "Click to grant control to @{username}",
  "presence.inControl": "In Control",
  "presence.active": "Active",
  "presence.takeControl": "Take Control",
  "presence.passControl": "Pass Control",
  "presence.reclaim": "Reclaim Room Control",
  "presence.room": "ROOM: {id}",
  "presence.copyLink": "Copy Room Link",
  "presence.leave": "Leave Current Session",
} as const;

export type TranslationKey = keyof typeof EN;
type Dictionary = Record<TranslationKey, string>;

// French uses a non-breaking space before "?", "!" and ":"
const FR: Dictionary = {
  // Common
  "common.cancel": "Annuler",
  "common.you": "(Vous)",

  // Language
  "language.switchTo": "Passer en {name}",

  // Theme
  "theme.system": "Thème système",
  "theme.light": "Thème clair",
  "theme.dark": "Thème sombre",
  "theme.name.system": "système",
  "theme.name.light": "clair",
  "theme.name.dark": "sombre",
  "theme.switchTo": "{label} (passer au thème {next})",

  // Header
  "header.guest": "Guest {id}",
  "header.superuser": "SuperUser",

  // Login / Link
  "auth.login": "Se connecter",
  "auth.linkAccount": "Associer un compte",
  "auth.loginTitle": "Se connecter à votre compte",
  "auth.linkTitle": "Associer un nouveau compte",
  "auth.loginDescription": "Pour commencer, choisir un compte parmi les fournisseurs ci-dessous, puis associer un autre profil plus tard",
  "auth.linkDescription": "Associer à votre compte un autre profil parmi les fournisseurs ci-dessous pour plus de flexibilité de connexion",
  "auth.continueWithGoogle": "Continuer avec Google",
  "auth.continueWithFacebook": "Continuer avec Facebook",

  // Logout
  "auth.logout": "Se déconnecter",
  "auth.logoutTitle": "Se déconnecter de votre compte",
  "auth.logoutConfirm": "Voulez-vous vraiment vous déconnecter ?",
  "auth.loggingOut": "Déconnexion...",

  // Consent
  "consent.title": "Créer un nouveau compte",
  "consent.description": "Nous ne trouvons aucun compte existant associé à ce profil",
  "consent.details": "Vous pouvez annuler ce processus, vous connecter à votre compte existant le cas échéant et y associer ce profil, OU continuer pour commencer avec un nouveau compte",
  "consent.creating": "Création...",
  "consent.create": "Créer le compte",

  // Account activation / deletion
  "account.cancelDeletion": "Annuler la suppression",
  "account.activate": "Activer le compte",
  "account.cancelDeletionTitle": "Annuler la suppression de votre compte",
  "account.reactivateTitle": "Réactiver votre compte",
  "account.pendingDeletionDescription": "Votre compte est programmé pour une suppression définitive. Annulez le processus pour conserver votre compte",
  "account.disabledDescription": "Votre compte est actuellement désactivé. Activez-le pour retrouver l'accès à toutes les fonctionnalités",
  "account.deactivate": "Désactiver le compte",
  "account.deactivateTitle": "Désactiver votre compte",
  "account.deactivateDescription": "Votre compte sera temporairement désactivé. Réactivez-le à tout moment pour retrouver l'accès à toutes les fonctionnalités",
  "account.delete": "Supprimer le compte",
  "account.deleteTitle": "Supprimer votre compte",
  "account.deleteDescription": "Votre compte sera placé en attente de suppression définitive. Réactivez-le pour empêcher sa suppression définitive",
  "account.processing": "Traitement...",
  "account.deleteAll": "Supprimer tous les comptes",

  // Toasts
  "toast.loginSuccess": "Connexion réussie",
  "toast.signupSuccess": "Votre compte a été créé",
  "toast.linkSuccess": "Vos comptes sont maintenant associés",
  "toast.linkError": "Ce compte est déjà associé à un autre utilisateur",
  "toast.providerSuccess": "Votre compte est déjà associé à cet utilisateur",
  "toast.providerError": "Vous ne pouvez pas associer des comptes du même fournisseur",
  "toast.authError": "Échec de l'authentification",
  "toast.genericError": "Une erreur s'est produite",
  "toast.loggedOut": "Déconnexion réussie",
  "toast.allDeletionsProcessed": "Toutes les suppressions de comptes programmées ont été traitées",
  "toast.deletionScheduled": "La suppression de votre compte a été programmée",
  "toast.deactivated": "Votre compte a été désactivé",
  "toast.reactivated": "Votre compte a été réactivé",

  // AI chat
  "chat.welcome": "Salut, qu'avez-vous en tête ?",
  "chat.placeholder": "Demandez n'importe quoi...",
  "chat.send": "Envoyer le message",

  // Code blocks
  "code.defaultLabel": "code",
  "code.copied": "Copié dans le presse-papiers",
  "code.copy": "Copier le code",
  "code.download": "Télécharger l'extrait",

  // Rooms menu
  "rooms.create": "Créer un nouveau salon",
  "rooms.active": "Salons actifs",
  "rooms.loading": "Chargement des salons...",
  "rooms.empty": "Aucun salon disponible",
  "rooms.delete": "Supprimer le salon",
  "rooms.deleteConfirm": "Voulez-vous vraiment supprimer définitivement ce salon ?",

  // Room chat
  "roomChat.title": "Discussion du salon",
  "roomChat.placeholder": "Saisissez un message...",
  "roomChat.send": "Envoyer",

  // Presence card
  "presence.participants": "Participants en ligne ({count})",
  "presence.host": "Hôte",
  "presence.grantControl": "Cliquer pour donner le contrôle à @{username}",
  "presence.inControl": "En contrôle",
  "presence.active": "Actif",
  "presence.takeControl": "Prendre le contrôle",
  "presence.passControl": "Céder le contrôle",
  "presence.reclaim": "Reprendre le contrôle du salon",
  "presence.room": "SALON : {id}",
  "presence.copyLink": "Copier le lien du salon",
  "presence.leave": "Quitter la session",
};

export const TRANSLATIONS: Record<Language, Dictionary> = { EN, FR };

// Native names, shown the same way whatever the current language
export const LANGUAGE_NAMES: Record<Language, string> = {
  EN: "English",
  FR: "Français",
};

import type { DefaultSession } from 'next-auth'

export type RoleUtilisateur = 'ADMIN' | 'CLIENT'

declare module 'next-auth' {
  interface User {
    id: string
    role: RoleUtilisateur
  }

  interface Session {
    user: {
      id: string
      role: RoleUtilisateur
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: RoleUtilisateur
  }
}

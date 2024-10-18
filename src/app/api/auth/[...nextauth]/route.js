import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Here you would usually make a request to your backend API
        // to verify the credentials and get the user data
        // For this example, we'll use a mock user
        if (credentials. email === 'user' && credentials.password === 'password') {
          return { id: 1, name: 'User' }
        }
        console.log('control here')
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    }
  }
})

export { handler as GET, handler as POST }
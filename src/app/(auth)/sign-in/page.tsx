"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function SignInComponent() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      <p>Not signed in</p>
      <button className="bg-orange-500 text-white rounded-lg px-3 py-1 m-4" onClick={() => signIn()}>Sign in</button>
    </>
  );
}

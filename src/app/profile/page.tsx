"use client";
/* eslint-disable @next/next/no-img-element */
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/Spinner";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <Spinner />;
  const user = session?.user;
  if (!user) return null;

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <title>BookNook | My Profile</title>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          {user.image ? (
            <img src={user.image} alt={user.name} referrerPolicy="no-referrer" className="h-28 w-28 rounded-full object-cover" />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary text-4xl text-primary-content">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-base-content/70">{user.email}</p>
        </div>
      </div>
    </section>
  );
}
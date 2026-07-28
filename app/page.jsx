import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen items-center justify-center gap-4">
        <Link className="btn" href="/login">
          Login
        </Link>
        <Link className="btn btn-primary" href="/signup">
          Register
        </Link>
      </div>
    </main>
  );
}

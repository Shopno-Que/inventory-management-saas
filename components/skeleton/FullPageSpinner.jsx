export default function FullPageSpinner({ message = "লোড হচ্ছে..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-t-transparent border-primary animate-spin"
        />

        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}

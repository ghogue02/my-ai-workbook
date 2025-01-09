// File: app/(auth)/layout.tsx
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // no session check here, so the login page actually renders
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
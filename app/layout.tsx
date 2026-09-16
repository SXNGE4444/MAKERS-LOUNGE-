import "./styles.css";

export const metadata = {
  title: "Makers Lounge — Hackathon Control Room",
  description: "Shared team operating system for The Makers hackathon team."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

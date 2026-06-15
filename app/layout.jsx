export const metadata = { title: "HermesHub", description: "Hermes Agent Dashboard" };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#080815" }}>{children}</body>
    </html>
  );
}

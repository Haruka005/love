export default function BaseCard({ children }) {
  return (
    <div className="card">
      <div className="card-content">{children}</div>
    </div>
  );
}

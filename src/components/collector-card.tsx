type CollectorInfo = {
  name: string;
  phone: string;
  area: string;
} | null;

export function CollectorCard({ collector }: { collector: CollectorInfo }) {
  if (!collector) {
    return <p className="muted">No collector assigned yet.</p>;
  }

  return (
    <dl className="detail-list">
      <div>
        <dt>Name</dt>
        <dd>{collector.name}</dd>
      </div>
      <div>
        <dt>Phone</dt>
        <dd>{collector.phone}</dd>
      </div>
      <div>
        <dt>Area</dt>
        <dd>{collector.area}</dd>
      </div>
    </dl>
  );
}

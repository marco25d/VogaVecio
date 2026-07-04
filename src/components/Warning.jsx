export default function Warning({ activity }) {
  if (activity === 'galea') {
    return (
      <div className="warning warning-info">
        ⚓ Rough conditions — but the Galea veneziana can handle it. Proceed with caution.
      </div>
    );
  }
  return (
    <div className="warning warning-danger">
      ⚠️ Conditions are dangerous for this vessel. Consider switching to the Galea veneziana or postpone the trip.
    </div>
  );
}

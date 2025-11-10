const SpecialRequestSection = () => {
  return (
    <section className="p-4 border rounded-xl bg-white shadow-sm">
      <h2 className="font-semibold mb-3">Special Request</h2>
      <textarea
        name="specialRequest"
        placeholder="Any special request (decoration, MC, flowers...)"
        rows={3}
        className="w-full p-2 border rounded-lg"
      />
    </section>
  );
};

export default SpecialRequestSection;

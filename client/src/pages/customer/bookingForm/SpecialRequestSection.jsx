import useBooking from "../../../hooks/useBooking";

const SpecialRequestSection = () => {
  const { booking, setBookingField } = useBooking();
  const value = booking?.bookingInfo?.specialRequest || "";
  return (
    <section className="p-4 border rounded-xl bg-white shadow-sm">
      <h2 className="font-semibold mb-3">Special Request</h2>
      <textarea
       style={{ width: "100%" }}
        name="specialRequest"
        placeholder="Any special request (decoration, MC, flowers...)"
        rows={3}
        className="w-full p-2 border rounded-lg"
        value={value}
        onChange={(e) => setBookingField("specialRequest", e.target.value)}
      />
    </section>
  );
};

export default SpecialRequestSection;

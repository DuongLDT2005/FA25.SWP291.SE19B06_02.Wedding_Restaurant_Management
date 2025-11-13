import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAmenities } from "../redux/slices/amenitySlice";

export default function useAmenity() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.amenities);

  useEffect(() => {
    dispatch(fetchAmenities());
  }, [dispatch]);

  return { amenities: list, loading, error };
}

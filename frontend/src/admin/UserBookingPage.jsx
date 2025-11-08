import { useParams } from "react-router-dom";
import BookingForm from "../pages/BookingForm";

const UserBookingPage = () => {
  const { scheduleId } = useParams(); // scheduleId comes from URL
  return <BookingForm scheduleId={scheduleId} />;
};

export default UserBookingPage;

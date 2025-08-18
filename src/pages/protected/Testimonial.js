import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import Testimonial from "../../features/Testimonial";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Testimonials" }));
  }, []);

  return <Testimonial />;
}

export default InternalPage;

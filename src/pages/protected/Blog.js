import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import Blog from "../../features/blog";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Blog Management" }));
  }, [dispatch]);

  return <Blog />;
}

export default InternalPage;

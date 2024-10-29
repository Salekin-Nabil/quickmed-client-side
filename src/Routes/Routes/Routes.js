import { createBrowserRouter } from "react-router-dom";
import Main from "../../Layout/Main";
import Appointment from "../../Pages/Appointment/Appointment/Appointment";
import Home from "../../Pages/Home/Home";
import About from "../../Pages/About/About";
import Reviews from "../../Pages/Reviews/Reviews";
import Login from "../../Pages/Login/Login";
import Signup from "../../Pages/Login/Signup";
import RequireAuth from "../../Pages/Login/RequireAuth";
import MyAppointment from "../../Pages/Dashboard/MyAppointment/MyAppointment";
import Dashboard from "../../Pages/Dashboard/Dashboard/Dashboard";
import MyReviews from "../../Pages/Dashboard/MyReviews/MyReviews";
import MyHistory from "../../Pages/Dashboard/MyHistory/MyHistory";
import AllUsers from "../../Pages/Dashboard/AllUsers/AllUsers";
import RequireAdmin from "../../Pages/Login/RequireAdmin";
import AllBookings from "../../Pages/Dashboard/AllBookings/AllBookings";
import VideoCall from "../../Pages/VideoCall/VideoCall";
import ApplyDoctor from "../../Pages/ApplyDoctor/ApplyDoctor";
import DoctorsApplication from "../../Pages/Dashboard/DoctorsApplication/DoctorsApplication";
import Payment from "../../Pages/Dashboard/Checkout/Payment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/about", element: <About /> },
      { path: "/reviews", element: <Reviews /> },
      {
        path: "/appointment",
        element: (
          <RequireAuth>
            <Appointment />
          </RequireAuth>
        ),
      },
      {
        path: "/call/:userId/to/:secondUserId",
        element: (
          <RequireAuth>
            <VideoCall />
          </RequireAuth>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
        children: [
          { path: "/dashboard", element: <MyAppointment /> },
          { path: "/dashboard/my_reviews", element: <MyReviews /> },
          { path: "/dashboard/my_history", element: <MyHistory /> },
          {
            path: "/dashboard/users",
            element: (
              <RequireAdmin>
                <AllUsers />
              </RequireAdmin>
            ),
          },
          {
            path: "/dashboard/all_bookings",
            element: (
              <RequireAdmin>
                <AllBookings />
              </RequireAdmin>
            ),
          },
          {
            path: "/dashboard/doctors_applications",
            element: (
              <RequireAdmin>
                <DoctorsApplication />
              </RequireAdmin>
            ),
          },
          { path: "/dashboard/payment/:id", element: <Payment /> },
        ],
      },
      {
        path: "/apply_as_a_doctor",
        element: (
          <RequireAuth>
            <ApplyDoctor />
          </RequireAuth>
        ),
      },
    ],
  },
]);

export default router;

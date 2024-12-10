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
import Summary from "../../Pages/Dashboard/MyAppointment/Summary";
import Dashboard from "../../Pages/Dashboard/Dashboard/Dashboard";
import MyReviews from "../../Pages/Dashboard/MyReviews/MyReviews";
import MyProfile from "../../Pages/Dashboard/MyProfile/MyProfile";
import CreateProfile from "../../Pages/Dashboard/CreateProfile/CreateProfile";
import UpdateProfile from "../../Pages/Dashboard/UpdateProfile/UpdateProfile";
import ViewProfile from "../../Pages/Dashboard/ViewProfile/ViewProfile";
import MyHistory from "../../Pages/Dashboard/MyHistory/MyHistory";
import AllUsers from "../../Pages/Dashboard/AllUsers/AllUsers";
import RequireAdmin from "../../Pages/Login/RequireAdmin";
import AllBookings from "../../Pages/Dashboard/AllBookings/AllBookings";
import ApplyDoctor from "../../Pages/ApplyDoctor/ApplyDoctor";
import DoctorsApplication from "../../Pages/Dashboard/DoctorsApplication/DoctorsApplication";
import Payment from "../../Pages/Dashboard/Checkout/Payment";
import VideoCall from "../../Pages/VideoCall/VideoCall";
import DoctorAppointment from "../../Pages/Dashboard/DoctorAppointment/DoctorAppointment";
import RequireDoctor from "../../Pages/Login/RequireDoctor";
import ConsultPatient from "../../Pages/Dashboard/ConsultPatient/ConsultPatient";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Main></Main>, 
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: '/signup',
                element: <Signup></Signup>
            },
            {
                path: '/about',
                element: <About></About>
            },
            {
                path: '/reviews',
                element: <Reviews></Reviews>
            },
            {
                path: '/appointment',
                element: <RequireAuth><Appointment></Appointment></RequireAuth>
            },
            {
                path: "/call/:userId/to/:secondUserId/for/:appointmentID",
                element: (
                  <RequireAuth>
                    <VideoCall />
                  </RequireAuth>
                ),
              },
            {
                path: '/dashboard',
                element: <RequireAuth>
                    <Dashboard></Dashboard>
                    </RequireAuth>,
                children: [
                    {
                        path: '/dashboard',
                        element: <MyAppointment></MyAppointment>
                    },
                    {
                        path: '/dashboard/summary/:id',
                        element: <Summary></Summary>
                    },
                    {
                        path: '/dashboard/my_reviews',
                        element: <MyReviews></MyReviews>
                    },
                    {
                        path: '/dashboard/my_profile',
                        element: <MyProfile></MyProfile>
                    },
                    {
                        path: '/dashboard/my_profile/create_profile',
                        element: <CreateProfile></CreateProfile>
                    },
                    {
                        path: '/dashboard/my_profile/update_profile',
                        element: <UpdateProfile></UpdateProfile>
                    },
                    {
                        path: '/dashboard/my_profile/view_profile',
                        element: <ViewProfile></ViewProfile>
                    },
                    {
                        path: '/dashboard/my_history',
                        element: <MyHistory></MyHistory>
                    },
                    {
                        path: '/dashboard/doctor_appointment',
                        element: <RequireDoctor><DoctorAppointment></DoctorAppointment></RequireDoctor>
                    },
                    {
                        path: '/dashboard/consult_patient/:wallet',
                        element: <RequireDoctor><ConsultPatient></ConsultPatient></RequireDoctor>
                    },
                    {
                        path: '/dashboard/users',
                        element: <RequireAdmin><AllUsers></AllUsers></RequireAdmin>
                    },
                    {
                        path: '/dashboard/all_bookings',
                        element: <RequireAdmin><AllBookings></AllBookings></RequireAdmin>
                    },
                    {
                        path: '/dashboard/doctors_applications',
                        element: <RequireAdmin><DoctorsApplication></DoctorsApplication></RequireAdmin>
                    },
                    {
                        path: '/dashboard/payment/:id',
                        element: <Payment></Payment>
                    },
                ]
            },
            {
                path: '/apply_as_a_doctor',
                element: <RequireAuth><ApplyDoctor></ApplyDoctor></RequireAuth>
            },
        ]
    }
])

export default router;
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPanel from "./components/AdminPanel";
import ManageServices from "./components/ManageServices";
import ManageServicesAdd from "./components/ManageServicesAdd";
import ManageServicesUpdate from "./components/ManageServicesUpdate";
import ViewFeedback from "./components/ViewFeedback";
import ViewAppoinments from "./components/ViewAppoinments";
import ViewCustomers from "./components/ViewCustomers";
import UpdateProfile from "./components/UpdateProfile";
import ManagePets from "./components/ManagePets";
import ViewMyAppointments from "./components/ViewMyAppointments";
import CustomerPanel from "./components/CustomerPanel";
import GiveFeedback from "./components/GiveFeedback";
import Customerhome from "./components/Customerhome";
import BookAppointment1 from "./components/BookAppointment1";
import BookAppointment2 from "./components/BookAppointment2";
import Bill from "./components/Bill";
const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="manageservices-add" element={<ManageServicesAdd />} />
        <Route
          path="manageservices-update/:id"
          element={<ManageServicesUpdate />}
        />

        {/* Admin Routes as Parent */}
        <Route path="/admin" element={<AdminPanel />}>
          <Route path="manageservices" element={<ManageServices />} />
          <Route path="view-feedback" element={<ViewFeedback />} />
          <Route path="view-appointments" element={<ViewAppoinments />} />
          <Route path="view-customers" element={<ViewCustomers/>} />
        </Route>

         {/* Customer Routes as Parent  */}
         <Route path="/customer" element={<CustomerPanel />}>
          <Route path="customerhome" element={<Customerhome/>}/>
          <Route path="updateprofile" element={<UpdateProfile />} />
          <Route path="managepets" element={<ManagePets />} />
          <Route path="viewmyappointments" element={<ViewMyAppointments />} />
          <Route path="bookappointments1/:petId" element={<BookAppointment1/>} />
          <Route path="bookappointment2" element={<BookAppointment2 />} />
          <Route path="givefeedback" element={<GiveFeedback/>}></Route>
          <Route path="bill" element={<Bill/>}></Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;

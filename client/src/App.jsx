
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Campaign from "./Pages/Campaign";
import Report from "./Pages/Report";
import { Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer";
import Form from './Pages/Form';
import IndividualCamp from "./Pages/IndividualCamp";
import Login from './Pages/Login';
import Register from "./Pages/Register";
import Unauth from './Pages/Unauth';
import ProtectedRoute from "./Components/ProtectedRoute";
import Profile from "./Pages/Profile";
import LandingPage from "./Pages/LandingPage";
import WarehouseUploader from "./Pages/WarehouseUploader";
// import "./App.css"; 

function App() {
  return (
    <>


      <div className=" min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 w-full">
        {/* <Navbar /> */}

        <Routes>
          <Route
          path="/"
          element={<LandingPage/>}
          />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/Campaign" element={
            <ProtectedRoute>
              <Campaign />
            </ProtectedRoute>
          } />

          <Route path="/Report" element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          } />

          <Route path="/Add-campaign" element={
            <ProtectedRoute>
              <Form />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/campaign/:campaignId" element={
            <ProtectedRoute>
              <IndividualCamp />
            </ProtectedRoute>
          } />

          <Route path="/createWarehouse" element={
            <ProtectedRoute>
              <WarehouseUploader />
            </ProtectedRoute>
          } />

          <Route path="/unauth" element={<Unauth />} />
        </Routes>

        {/* <Footer /> */}
      </div>
    </>
  )
}

export default App;

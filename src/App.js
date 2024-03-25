import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import PrivateRoute from './components/misc/PrivateRoute';
import Navbar from './components/misc/Navbar';
import Home from './components/home/Home';
import Login from './components/home/Login';
import Signup from './components/home/Signup';
import AdminPage from './components/admin/AdminPage';
import UserPage from './components/user/UserPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    // const navigate = useNavigate();
    // const history = useNavigate();

    const handleLoginShow = () => {
        console.log("coming to main")
        setShowLoginModal(true);
    };

    const handleLoginClose = () => {
        setShowLoginModal(false);
        // return <Navigate to={'/'} />;
        // navigate('/');
    };

    const handleSignupShow = () => {
        console.log("coming to second main")
        setShowSignupModal(true);
    };

    const handleSignupClose = () => {
        setShowSignupModal(false);
        // return <Navigate to={'/'} />;
    };

    return (
        <AuthProvider>
            <Router>
                <Navbar handleLoginShow={handleLoginShow} handleSignupShow={handleSignupShow} />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login show={showLoginModal} handleClose={handleLoginClose} handleSignupShow ={handleSignupShow} />} />
                    <Route path='/signup' element={<Signup show={showSignupModal} handleClose={handleSignupClose} handleLoginShow={handleLoginShow} />} />
                    <Route path="/adminpage" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
                    <Route path="/userpage" element={<PrivateRoute><UserPage /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

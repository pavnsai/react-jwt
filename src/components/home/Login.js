import React, { useState } from 'react';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../misc/OrderApi';
import { parseJwt, handleLogError } from '../misc/Helpers';

function Login({ show, handleClose, handleSignupShow }) {
  const Auth = useAuth();
  const isLoggedIn = Auth.userIsAuthenticated();
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
console.log("inside"+show);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') { // Changed from username to email
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(email && password)) { // Changed from username to email
      setIsError(true);
      return;
    }

    try {
      const response = await orderApi.authenticate(email, password); // Changed from username to email
      const { accessToken } = response.data;
      const data = parseJwt(accessToken);
      const authenticatedUser = { data, accessToken };

      Auth.userLogin(authenticatedUser);

      setEmail(''); // Changed from username to email
      setPassword('');
      setIsError(false);
      navigate('/');
      handleClose(); // Close the modal on successful login
    } catch (error) {
      handleLogError(error);
      setIsError(true);
    }
  };

  if (isLoggedIn) {
    return <Navigate to={'/'} />;
  }

  return (
      <Modal show={show} onHide={()=>{navigate('/') }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label> {/* Changed from Username to Email */}
              <Form.Control type="email" name="email" value={email} onChange={handleInputChange} /> {/* Changed from Username to Email */}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={password} onChange={handleInputChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block">Login</Button>
          </Form>
          {isError && <Alert variant="danger" className="mt-3">The email or password provided is incorrect!</Alert>}
          <div className="mt-3 text-center">Don't have an account? <NavLink to="/signup" onClick={handleSignupShow}>Sign Up</NavLink></div>
        </Modal.Body>
      </Modal>
  );
}

export default Login;

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(username && password)) {
      setIsError(true);
      return;
    }

    try {
      const response = await orderApi.authenticate(username, password);
      const { accessToken } = response.data;
      const data = parseJwt(accessToken);
      const authenticatedUser = { data, accessToken };

      Auth.userLogin(authenticatedUser);

      setUsername('');
      setPassword('');
      setIsError(false);
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
      // <Modal show={show} onHide={handleClose} centered>
        <Modal show={show} onHide={()=>{navigate('/') }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" value={username} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={password} onChange={handleInputChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block">Login</Button>
          </Form>
          {isError && <Alert variant="danger" className="mt-3">The username or password provided is incorrect!</Alert>}
          <div className="mt-3 text-center">Don't have an account? <NavLink to="/signup" onClick={handleSignupShow}>Sign Up</NavLink></div>
        </Modal.Body>
      </Modal>
  );
}

export default Login;

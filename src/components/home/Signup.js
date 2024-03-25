import React, { useState } from 'react';
import {NavLink, Navigate, useNavigate} from 'react-router-dom';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../misc/OrderApi';
import { parseJwt, handleLogError } from '../misc/Helpers';

function Signup({ show, handleClose, handleLoginShow }) {
  const Auth = useAuth();
  const isLoggedIn = Auth.userIsAuthenticated();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(username && password && name && email)) {
      setIsError(true);
      setErrorMessage('Please, inform all fields!');
      return;
    }

    const user = { username, password, name, email };

    try {
      const response = await orderApi.signup(user);
      const { accessToken } = response.data;
      const data = parseJwt(accessToken);
      const authenticatedUser = { data, accessToken };

      Auth.userLogin(authenticatedUser);

      setUsername('');
      setPassword('');
      setName('');
      setEmail('');
      setIsError(false);
      setErrorMessage('');
      handleClose(); // Close the modal on successful signup
    } catch (error) {
      handleLogError(error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        let errorMessage = 'Invalid fields';
        if (errorData.status === 409) {
          errorMessage = errorData.message;
        } else if (errorData.status === 400) {
          errorMessage = errorData.errors[0].defaultMessage;
        }
        setIsError(true);
        setErrorMessage(errorMessage);
      }
    }
  };

  if (isLoggedIn) {
    return <Navigate to='/' />;
  }

  return (
      <Modal show={show} onHide={()=>{navigate('/') }} centered>
      {/*<Modal show={show} onHide={handleClose} centered>*/}
        <Modal.Header closeButton>
          <Modal.Title>Signup</Modal.Title>
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
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={email} onChange={handleInputChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block">Signup</Button>
          </Form>
          {isError && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
          <div className="mt-3 text-center">Already have an account? <NavLink to="/login" onClick={handleLoginShow}>Login</NavLink></div>
        </Modal.Body>
      </Modal>
  );
}

export default Signup;

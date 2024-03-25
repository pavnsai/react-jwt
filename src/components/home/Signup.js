import React, { useState } from 'react';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../misc/OrderApi';
import { parseJwt, handleLogError } from '../misc/Helpers';

function Signup({ show, handleClose, handleLoginShow }) {
  const Auth = useAuth();
  const isLoggedIn = Auth.userIsAuthenticated();
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  console.log("second inside"+show);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'firstname') {
      setFirstname(value);
    } else if (name === 'lastname') {
      setLastname(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else if (name === 'email') {
      setEmail(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(firstname && lastname && password && confirmPassword && email)) {
      setIsError(true);
      setErrorMessage('Please, fill in all fields!');
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setErrorMessage('Passwords do not match!');
      return;
    }

    const user = { firstname, lastname, password, email };

    try {
      const response = await orderApi.signup(user);
      const { accessToken } = response.data;
      const data = parseJwt(accessToken);
      const authenticatedUser = { data, accessToken };

      Auth.userLogin(authenticatedUser);

      setFirstname('');
      setLastname('');
      setPassword('');
      setConfirmPassword('');
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
        <Modal.Header closeButton>
          <Modal.Title>Signup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstname" value={firstname} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastname" value={lastname} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={password} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" name="confirmPassword" value={confirmPassword} onChange={handleInputChange} />
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

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { signin, signInWithGoogle } from "../helpers/auth";
import { Button, Form } from "react-bootstrap";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: "" });
    try {
      await signin(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async googleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <>
        <style type="text/css">{`

body {
  background-color: #fcf8eb;
}

.loginpage{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-image: linear-gradient(#ffe25e, #fcebbb);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.loginsection{
  width: 700px;
  min-height: auto;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0px;
  margin-bottom: 0px;
  background-color: #faf0cf;
  padding: 20px;
  border-color: gray;
  border-width: 5px;
  border-style: solid;
  border-radius: 10px;
}

.center{
  text-align: center;
}
         
         `}</style>
        <div class="loginpage">
          <section class="loginsection">
            <h1 class="center">
              Login to <Link to="/">FridgeShare</Link>
            </h1>
            <br></br>
            <p>Fill in the form below to login to your account.</p>
            <div>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    onChange={this.handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    onChange={this.handleChange}
                  />
                </Form.Group>

                {this.state.error ? <p>{this.state.error}</p> : null}

                <Button
                  variant="primary"
                  type="submit"
                  onClick={this.handleSubmit}
                >
                  Login
                </Button>
              </Form>
            </div>
            <hr />
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
            {/* </form> */}
          </section>
        </div>
      </>
    );
  }
}

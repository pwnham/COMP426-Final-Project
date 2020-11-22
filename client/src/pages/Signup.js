import React, { Component } from "react";
import { Link } from "react-router-dom";
import { signup, signInWithGoogle } from "../helpers/auth";
import { Button, Form } from "react-bootstrap";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: "",
      password: "",
      groupName: "",
      createGroup: "",
      name: "",
      isChecked: false,
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
      await signup(
        this.state.name,
        this.state.email,
        this.state.password,
        this.state.isChecked ? this.state.createGroup : this.state.groupName,
        this.state.isChecked
      );
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

.signuppage{
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

.signupsection{
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
        <div class="signuppage">
          <section class="signupsection">
            <h1 class="center">
              Sign Up to <Link to="/">FridgeShare</Link>
            </h1>
            <br></br>
            <p>Fill in the form below to create your account.</p>
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

              <Form.Group controlId="formBasicName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="name"
                  type="name"
                  placeholder="Enter Name"
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicGroupName">
                <Form.Label>
                  Enter the name of the group you would like to join!
                </Form.Label>
                <Form.Control
                  name="groupName"
                  type="groupName"
                  placeholder="Enter Group Name"
                  onChange={this.handleChange}
                  disabled={this.state.isChecked}
                />
                <Form.Text className="text-muted">
                  Ensure that this name is correct!
                </Form.Text>
              </Form.Group>

              <Form.Check
                type="checkbox"
                id="chooseCreateGroup"
                label="Or Create A Group!"
                onChange={() =>
                  this.setState({ isChecked: !this.state.isChecked })
                }
              ></Form.Check>
              <br></br>

              {this.state.isChecked ? (
                <Form.Group controlId="formCreateGroup">
                  <Form.Label>
                    Enter the name of the Group You'll Create
                  </Form.Label>
                  <Form.Control
                    name="createGroup"
                    type="createGroup"
                    placeholder="Enter New Group Name"
                    onChange={this.handleChange}
                  />
                </Form.Group>
              ) : null}

              {this.state.error ? <p>{this.state.error}</p> : null}

              <Button
                variant="primary"
                type="submit"
                onClick={this.handleSubmit}
              >
                Sign Up
              </Button>
            </Form>
            <hr />
            <p>
              Already have an account? <Link to="/login">Log In</Link>
            </p>
            {/* </form> */}
          </section>
        </div>
      </>
    );
  }
}

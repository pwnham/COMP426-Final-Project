import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Home extends Component {
  render() {
    return (
      <div>
        <section>
          <div>
            <div>
              <h1>Welcome to FridgeShare</h1>
              <p>A Collaborative Fridge Tool</p>
              <div>
                <Link to="/signup">Create New Account</Link>
                <br></br>
                <Link to="/login">Login to Your Account</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

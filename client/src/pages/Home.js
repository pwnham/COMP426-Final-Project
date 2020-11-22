import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Jumbotron } from "react-bootstrap";

export default class Home extends Component {
  render() {
    return (
      <>
        <style type="text/css">{`

body {
  background-color: #fcf8eb;
}

.lightcolor{
  background-color: #fcebbb;
}

.darkcolor{
  background-color: #ffe25e;
}

.center{
  padding-left: 200px;
  padding-right: 200px;

}

.title{
  text-align: left;
}

.jumbotron{
  background-color: transparent;
}
         
         `}</style>
        <div class="darkcolor center">
          <Jumbotron>
            <div>
              <section>
                <div>
                  <div>
                    <h1>FridgeShare</h1>
                    <Link to="/signup">Create New Account</Link>
                    <Link to="/login">Login to Your Account</Link>
                  </div>
                </div>
              </section>
            </div>
          </Jumbotron>
        </div>
        <div class="lightcolor center">
          <Jumbotron>
            <div>
              <h1>Welcome to FridgeShare</h1>
              <p>A Collaborative Fridge Tool</p>
            </div>
          </Jumbotron>
        </div>
      </>
    );
  }
}

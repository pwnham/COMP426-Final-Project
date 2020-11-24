import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Jumbotron, Button } from "react-bootstrap";

export default class Home extends Component {
  render() {
    return (
      <>
        <style type="text/css">{`

body {
  background-color: #fcebbb;
}

.lightcolor{
  background-color: #fcebbb;
}

.darkcolor{
  background-color: #ffe25e;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: black;
}

.inline{
  display: inline;
}

.jumbotron{
  background-color: transparent;
}

.size{
  width: 800px;
  margin-right: auto;
  margin-left: auto;
  align-self: center;
  align-items: center;
  justify-content: space-between;
}

.size2{
  display: flex;
}

.btn, .btn-primary{
  border-style: solid;
  border-color: #5c5c5c;
  border-width: 2px;
  background-color: transparent;
  color: #5c5c5c;
  
}

.btn-primary:hover {
  color: white;
  background-color: #5c5c5c;
  border-color: black;
}

.buttongroup{
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.left{
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.signup-button{
  margin-right: 8px;
}


         `}</style>
        <div class="darkcolor">
          <Jumbotron>
            <div class="size size2">
              <div class="left inline">
                <h1 class>FridgeShare</h1>
              </div>
              <div class="buttongroup inline">
                <a href="/signup" class="btn btn-primary signup-button">
                  Sign Up
                </a>
                <a href="/login" class="btn btn-primary">
                  Login
                </a>
              </div>
            </div>
          </Jumbotron>
        </div>
        <div class="lightcolor">
          <Jumbotron>
            <div class="size">
              <div>
                <h1>Welcome to FridgeShare</h1>
              </div>
              <div>
                <p>
                  A collaborative fridge tool to help you manage your fridge in
                  group settings. All it takes is a few presses and all of the
                  group mishaps of other people taking your food will be solved
                  in seconds!
                </p>
              </div>
            </div>
          </Jumbotron>
        </div>
      </>
    );
  }
}

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { signout } from "../helpers/auth";
import fridgeHead from "../fridgeHead.png";
import "react-dropdown/style.css";

export class Header extends Component {
  constructor(props) {
    super(props);
    this.signOutUser = this.signOutUser.bind(this);
  }

  async signOutUser(event) {
    event.preventDefault();
    try {
      await signout();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  render() {
    return (
      <>
        <style type="text/css">{`
.header {
  background-color: #fcebbb;
  margin-right: 0px;
  margin-left: 0px;
  padding-right: 50px;
  padding-left: 90px;
  border-bottom-width: 2px;
  border-bottom-color: gray;
  border-bottom-style: solid;
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

  .signup-button{
	margin-right: 8px;
  }

  #nav_menu ul li button:hover{
	color: white;
	background-color: #5c5c5c;
	border-color: black;
	font-weight: normal;
  }

  #nav_menu ul li button{
	color: black;
	background-color: #fcebbb;
  }
`}</style>
        <div className="header">
          <div className="logo">
            <img src={fridgeHead} alt="fridge icon" height="45px"/>
            <h1>FridgeShare</h1>
          </div>

          <div className="leftHeader">
            <a href="/calendar" class="btn btn-primary signup-button">
              Calendar
            </a>
            <a href="/fridge" class="btn btn-primary signup-button">
              Fridge
            </a>

            <div id="nav_menu">
              <ul>
                <li>
                  <button id="drop1" class="btn btn-primary">
                    username
                  </button>
                  <ul>
                    <li>
                      <button id="drop2" class="btn btn-primary">
                        user info
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={this.signOutUser}
                        id="drop3"
                        class="btn btn-primary"
                      >
                        logout
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <br></br>
      </>
    );
  }
}
export default Header;

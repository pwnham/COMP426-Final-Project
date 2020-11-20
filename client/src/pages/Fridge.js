import React, { Component } from "react";
import { signout } from "../helpers/auth";

export default class Fridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
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
      <button onClick={this.signOutUser} type="button">
        Log Out?
      </button>
    );
  }
}

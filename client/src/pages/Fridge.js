import React, { Component } from "react";
import { signout } from "../helpers/auth";
import "react-bulma-components/dist/react-bulma-components.min.css";
import { Button } from "react-bulma-components";
import { Dropdown } from "react-bulma-components";
import { Columns } from "react-bulma-components";
import { Container } from "react-bulma-components";
import { List } from "react-bulma-components";

class Ingredient extends React.Component {
  render() {
    return (
      <div class="ingredient">
        <p>{this.props.name}</p>
        <p>{"Pay " + this.props.purchaser + " $" + this.props.price}</p>
        <p>{"Expiration Date: " + this.props.expiration}</p>
      </div>
    );
  }
}

export default class Fridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      showMessage: false,
    };
    this.signOutUser = this.signOutUser.bind(this);
  }

  createIngredient() {
    return (
      <Container>
        <Columns>
          <Columns.Column>
            <p className="has-text-left">pizza</p>
          </Columns.Column>
          <Columns.Column>
            <p className="has-text-centered">Pay 10 to Jag</p>
          </Columns.Column>
          <Columns.Column>
            <p className="has-text-right">Expires: 10/18/2020</p>
          </Columns.Column>
        </Columns>
      </Container>
    );
  }

  createList() {
    return (
      <Container>
        <List>
          <List.Item>{this.createIngredient()}</List.Item>
          <List.Item>{this.createIngredient()}</List.Item>
          <List.Item>{this.createIngredient()}</List.Item>
          <List.Item>{this.createIngredient()}</List.Item>
        </List>
      </Container>
    );
  }

  _showMessage = (bool) => {
    this.setState({
      showMessage: bool,
    });
  };

  handleClick() {
    {
      this._showMessage.bind(null, true);
      console.log(this.state.showMessage);
    }
  }

  createUser() {
    return (
      <Button onClick={() => this.handleClick()}>this will be clicked</Button>
    );
  }

  async signOutUser(event) {
    event.preventDefault();
    try {
      await signout();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  //var item1 = this.createIngredient("pizza", "James", 5, "10/18/2020");

  render() {
    return (
      <div>
        <button onClick={this.signOutUser} type="button">
          Log Out?
        </button>
        <br></br>
        {this.createUser()}
        {this.state.showMessage && this.createList()}
      </div>
    );
  }
}

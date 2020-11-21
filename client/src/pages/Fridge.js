import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion, Card, ListGroup, Button } from "react-bootstrap";
import { signout } from "../helpers/auth";
import { db } from "../services/firebase";

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
      members: [],
    };
    this.signOutUser = this.signOutUser.bind(this);
  }

  componentDidMount() {
    this.getFoods();
  }

  // createIngredient() {
  //   return (
  //     <Container>
  //       <Columns>
  //         <Columns.Column>
  //           <p className="has-text-left">pizza</p>
  //         </Columns.Column>
  //         <Columns.Column>
  //           <p className="has-text-centered">Pay 10 to Jag</p>
  //         </Columns.Column>
  //         <Columns.Column>
  //           <p className="has-text-right">Expires: 10/18/2020</p>
  //         </Columns.Column>
  //       </Columns>
  //     </Container>
  //   );
  // }

  // createList() {
  //   return (
  //     <Container>
  //       <List>
  //         <List.Item>{this.createIngredient()}</List.Item>
  //         <List.Item>{this.createIngredient()}</List.Item>
  //         <List.Item>{this.createIngredient()}</List.Item>
  //         <List.Item>{this.createIngredient()}</List.Item>
  //       </List>
  //     </Container>
  //   );
  // }

  // _showMessage = (bool) => {
  //   this.setState({
  //     showMessage: bool,
  //   });
  // };

  // handleClick() {
  //   {
  //     this._showMessage.bind(null, true);
  //     console.log(this.state.showMessage);
  //   }
  // }

  // createUser() {
  //   return (
  //     <Button onClick={() => this.handleClick()}>this will be clicked</Button>
  //   );
  // }

  async signOutUser(event) {
    event.preventDefault();
    try {
      await signout();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  handleDeleteFood(food, user) {
    console.log(food);
    console.log(user);
    console.log(this.state.members);

    const i = this.state.members.findIndex(
      (element) => element.name == user.name
    );

    const m = this.state.members;
    m[i].foods.splice(m[i].foods.indexOf(food), 1);
    this.setState({ members: m });
  }

  foodListToUI(user) {
    const uiList = [];

    const foods = user.foods;
    for (const [index, value] of foods.entries()) {
      uiList.push(
        <ListGroup.Item>
          {value}{" "}
          <Button
            variant="danger"
            className="float-right"
            onClick={() => this.handleDeleteFood(value, user)}
          >
            delete
          </Button>
        </ListGroup.Item>
      );
    }

    return uiList;
  }

  async getFoods() {
    const members = await db
      .ref("/groups/admins")
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        const res = [];
        for (var i = 0; i < data.members.length; i++) {
          res.push(data.members[i]);
        }
        return res;
      });
    this.setState({ members: members });
  }

  createUIForGroup() {
    const cards = [];
    const members = this.state.members;
    for (var i = 0; i < members.length; i++) {
      cards.push(
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey={i + 1}>
            {members[i].name}'s Food
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={i + 1}>
            <Card.Body>
              <ListGroup>{this.foodListToUI(members[i])}</ListGroup>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    }
    // this.setState({ fridgeItems: cards });
    return cards;
  }

  render() {
    return (
      <div>
        <br></br>
        <Accordion>{this.createUIForGroup()}</Accordion>
        <hr></hr>
        <button onClick={this.signOutUser} type="button">
          Log Out?
        </button>
      </div>
    );
  }
}

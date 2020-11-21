import React, { Component, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Accordion,
  Card,
  ListGroup,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
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
      showModal: false,
      modalName: "",
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
      (element) => element.name === user.name
    );

    const m = this.state.members;
    m[i].foods.splice(m[i].foods.indexOf(food), 1);
    this.setState({ members: m });
  }

  async updateFirebaseDoc() {
    db.ref("groups/admins").update({
      members: this.state.members,
    });
  }

  foodListToUI(user) {
    if (user.foods) {
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

      this.updateFirebaseDoc();
      return uiList;
    } else {
      return <p>This person has no food D:</p>;
    }
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

  renderModal() {
    return (
      <>
        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Food for {this.state.modalName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="forFoodName">
                <Form.Label>What food are you adding</Form.Label>
                <Form.Control type="foodName" placeholder="Enter food" />
              </Form.Group>
              <Button
                variant="secondary"
                onClick={() => this.setState({ showModal: false })}
              >
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ showModal: false });
                }}
              >
                Add Food
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  createUIForGroup() {
    const cards = [];
    const members = this.state.members;
    for (var i = 0; i < members.length; i++) {
      const name = members[i].name;
      cards.push(
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey={i + 1}>
            {name}'s Food
            <Button
              variant="success"
              className="float-right"
              onClick={() => {
                this.setState({ showModal: true, modalName: name });
              }}
            >
              Add Food
            </Button>
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
        {this.renderModal()}
      </div>
    );
  }
}

class AddFoodModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  render() {
    return (
      <>
        <Modal
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ show: false })}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => this.setState({ show: false })}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

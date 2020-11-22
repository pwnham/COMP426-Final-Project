import React, { Component } from "react";
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
import { db, auth } from "../services/firebase";

export default class Fridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      showModal: false,
      modalName: "",
      addedFood: "",
      groupName: "",
    };
    this.signOutUser = this.signOutUser.bind(this);
  }

  componentDidMount() {
    this.getFoods();
  }

  async signOutUser(event) {
    event.preventDefault();
    try {
      await signout();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  handleDeleteFood(food, user) {
    const i = this.state.members.findIndex(
      (element) => element.name === user.name
    );

    const m = this.state.members;
    m[i].foods.splice(m[i].foods.indexOf(food), 1);
    if (m[i].foods.length === 0) {
      m[i].foods = null;
    }
    this.setState({ members: m });
    this.updateFirebaseDoc();
  }

  async updateFirebaseDoc() {
    db.ref("groups/" + this.state.groupName).update({
      members: this.state.members,
    });
  }

  handleAddFood() {
    const i = this.state.members.findIndex(
      (element) => element.name === this.state.modalName
    );

    const m = this.state.members;
    if (m[i].foods) {
      m[i].foods.push(this.state.addedFood);
    } else {
      m[i].foods = [this.state.addedFood];
    }

    this.setState({ members: m });
    this.updateFirebaseDoc();
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

      return uiList;
    } else {
      return <p>This person has no food D:</p>;
    }
  }

  async getFoods() {
    const uid = await auth().currentUser.uid;
    var groupName = "";
    var members = [];
    const groups = await db
      .ref("/groups")
      .once("value")
      .then((snapshot) => {
        const groups = snapshot.val();
        console.log(groups);
        for (var key in groups) {
          console.log(groups[key]);
          const found = groups[key].members.find(
            (element) => element.uid === uid
          );
          if (found) {
            groupName = key;
            members = groups[key].members;
          }
        }
      });

    this.setState({ members: members, groupName: groupName });
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
                <Form.Control
                  type="foodName"
                  placeholder="Enter food"
                  onChange={(e) => this.setState({ addedFood: e.target.value })}
                />
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
                  this.handleAddFood();
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
      <>
        <style type="text/css">{`
body {
  background-color: #fcf8eb;
}

.accordion {
  border-style: solid;
  border-width: 5px;
  border-radius: 5px;
  margin-right: 50px;
  margin-left: 50px;
}

.card {
  background-color: #ffe25e;
  border-radius: 0;
  border-bottom-width: 5px;
  border-style: solid;
}

.list-group-item {
  background-color: #faf0cf;
  border-style: solid;
  border-width: 2px;
  border-color: gray;
}

.card-body {
  background-color:#fcebbb;
}

.btn, .btn-success, .btn-danger{
  border-style: solid;
  border-color: #5c5c5c;
  border-width: 2px;
}

.logout{
  border-color: gray;
  border-width: 2px;
  border-style: solid;
  border-radius: 4px;
  margin-left: 50px;
}

`}</style>
        <div>
          <br></br>
          <Accordion>{this.createUIForGroup()}</Accordion>
          <hr></hr>
          <button onClick={this.signOutUser} type="button" class="logout">
            Log Out?
          </button>
          {this.renderModal()}
        </div>
      </>
    );
  }
}

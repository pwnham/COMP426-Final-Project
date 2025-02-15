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
import Header from "../components/Header";
import Footer from "../components/Footer";
import { signout } from "../helpers/auth";
import { db, auth } from "../services/firebase";
import uuid from "uuid";

export default class Fridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      userName: "",
      showModal: false,
      modalName: "",
      addedFood: "",
      addedExpiryDate: "",
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
    const j = m[i].foods.findIndex((element) => element.name === food);
    m[i].foods.splice(j, 1);
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
    fetch(
      "https://calorieninjas.p.rapidapi.com/v1/nutrition?query=" +
        this.state.addedFood,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "af8c2d2137msh4e1e2a1f3750927p1604b6jsn3610d0a37a78",
          "x-rapidapi-host": "calorieninjas.p.rapidapi.com",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        const info = response.items[0];
        const foodID = uuid();

        const m = this.state.members;
        if (info) {
          if (m[i].foods) {
            m[i].foods.push({
              id: foodID,
              name: this.state.addedFood,
              hasInfo: true,
              calories: info.calories,
              protein: info.protein_g,
              carbs: info.carbohydrates_total_g,
              fat: info.fat_total_g,
              expiryDate: this.state.addedExpiryDate,
            });
          } else {
            m[i].foods = [
              {
                id: foodID,
                name: this.state.addedFood,
                hasInfo: true,
                calories: info.calories,
                protein: info.protein_g,
                carbs: info.carbohydrates_total_g,
                fat: info.fat_total_g,
                expiryDate: this.state.addedExpiryDate,
              },
            ];
          }
        } else {
          if (m[i].foods) {
            m[i].foods.push({
              id: foodID,
              name: this.state.addedFood,
              hasInfo: false,
              expiryDate: this.state.addedExpiryDate,
            });
          } else {
            m[i].foods = [
              {
                id: foodID,
                name: this.state.addedFood,
                hasInfo: false,
                expiryDate: this.state.addedExpiryDate,
              },
            ];
          }
        }

        this.setState({ members: m, addedExpiryDate: "" });
        this.updateFirebaseDoc();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  foodListToUI(user) {
    if (user.foods) {
      const uiList = [];

      const foods = user.foods;
      for (const [index, value] of foods.entries()) {
        uiList.push(
          <>
            <ListGroup.Item>
              {value.name}
              <Button
                variant="danger"
                className="float-right"
                onClick={() => this.handleDeleteFood(value.name, user)}
              >
                delete
              </Button>
              <Button
                variant="secondary"
                className="float-right"
                onClick={() => {
                  if (this.state[value.id]) {
                    this.setState({ [value.id]: false });
                  } else {
                    this.setState({ [value.id]: true });
                  }
                }}
              >
                {this.state[value.id] ? "Close Info" : "View Info"}
              </Button>
            </ListGroup.Item>
            {this.state[value.id] ? (
              value.hasInfo ? (
                <>
                  <ListGroup.Item className="info-card">
                    Per 100g
                  </ListGroup.Item>
                  <ListGroup.Item className="info-card">
                    Calories: {value.calories}
                  </ListGroup.Item>
                  <ListGroup.Item className="info-card">
                    Carbohydrates: {value.carbs}
                  </ListGroup.Item>
                  <ListGroup.Item className="info-card">
                    Protein: {value.protein}
                  </ListGroup.Item>
                  <ListGroup.Item className="info-card">
                    Fats: {value.fat}
                  </ListGroup.Item>
                </>
              ) : (
                <ListGroup.Item className="info-card">
                  No Nutritional Info!
                </ListGroup.Item>
              )
            ) : null}
          </>
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
    var user = "";
    var members = [];
    const groups = await db
      .ref("/groups")
      .once("value")
      .then((snapshot) => {
        const groups = snapshot.val();
        for (var key in groups) {
          const found = groups[key].members.find(
            (element) => element.uid === uid
          );
          if (found) {
            groupName = key;
            members = groups[key].members;
            user = found.name;
            console.log(user);
          }
        }
      });

    this.setState({ members: members, groupName: groupName, userName: user });
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

              <Form.Group controlId="forExpiryDate">
                <Form.Label>When will it expire? (Optional)</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter Date"
                  onChange={(e) =>
                    this.setState({ addedExpiryDate: e.target.value })
                  }
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

.info-card{
  background-color: #fcf8eb;
}

.fridgeTitle{
  text-align: center;
}
`}</style>
        <div>
          <Header username={this.state.userName} />
          <h1 class="fridgeTitle">{this.state.groupName}'s Fridge</h1>
          <br></br>
          <Accordion>{this.createUIForGroup()}</Accordion>
          <hr></hr>
          {this.renderModal()}
          <Footer />
        </div>
      </>
    );
  }
}

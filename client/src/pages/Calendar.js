import React, { Component } from "react";
import { signout } from "../helpers/auth";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles.css";
import { db, auth } from "../services/firebase";

export default class ExpiryCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
    this.signOutUser = this.signOutUser.bind(this);

    this.localizer = momentLocalizer(moment);
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

  async getFoods() {
    const uid = await auth().currentUser.uid;
    var groupName = "";
    var members = [];
    var user = {};
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
            user = found;
            break;
          }
        }
      });
    this.setState({ foods: user.foods });
  }

  createEvents() {
    return this.state.foods
      ? this.state.foods.map((food) => ({
          title: food.name,
          start: new Date(food.expiryDate),
          end: new Date(food.expiryDate),
        }))
      : [];
  }

  render() {
    return (
      <div className="calendarRoot">
        <Header />

        <div id="calendarView">
          <div className="calHeading">
            <h1 className="calName">Expiration Calendar</h1>
          </div>
          <Link className="calReturn" to="/fridge">
            Return to Fridge
          </Link>

          <Calendar
            localizer={this.localizer}
            startAccessor="start"
            endAccessor="end"
            events={this.createEvents()}
            defaultDate={moment().toDate()}
            style={{ height: 600, width: "95%" }}
            views={["month"]}
          />
        </div>

        <Footer />
      </div>
    );
  }
}

let eventsExpire = [
  {
    id: 0,
    title: "bread",
    start: new Date(2020, 10, 22),
    end: new Date(2020, 10, 22),
  },

  {
    id: 1,
    title: "milk",
    start: new Date(2020, 10, 28),
    end: new Date(2020, 10, 28),
  },
];

import React, { Component } from 'react';
import { signout } from '../helpers/auth';
import { Link } from 'react-router-dom';
import '../styles.css';
// import 'react-bulma-components/basic/react-bulma-components.min.css';
// import { Input } from 'react-bulma-components';

export default class Finances extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null
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

	renderPaidCheckbox() {
		return (
			<div className="paidCheckbox">
				<input type="checkbox" id="paid" name="paid" value="paid" />
				<label htmlFor="paid">Paid?</label>
			</div>
		);
	}

	renderOwerList(owers) {
		let list;
		list = owers.map((o, index) => {
			return (
				<div key={index}>
					{o} {this.renderPaidCheckbox}
				</div>
			);
		});
		return list;
    }
    
    // handleCheck(event) {

    // }

	render() {
		let payments = [];
		let eggs = new Payment('Ammar', [ 'Momo', 'Megan' ], 'eggs', 2, false);
		payments.push(eggs);
		let milk = new Payment('Megan', [ 'Momo' ], 'milk', 5, false);
		payments.push(milk);
		let bread = new Payment('Momo', [ 'Ammar' ], 'bread', 2, false);
		payments.push(bread);

		let elements = payments.map((p, index) => {
			return (
				<div key={index} className="paymentContainer">
					<p>
						You owe {p.buyer} ${p.amount} for {p.item}
					</p>
					{this.renderPaidCheckbox()}
				</div>
			);
		});

		let requests = [];
		let butter = new Request([ 'Ammar', 'Megan' ], 3, 'butter', false);
		let icecream = new Request([ 'Momo' ], 4, 'icecream', 'false');
		requests.push(butter);
		requests.push(icecream);

		let requestElms = requests.map((r, index) => {
			return (
				<div key={index} className="requestContainer">
					<p>
						Owes you ${r.amount} for {r.item}:
					</p>
					<div> {this.renderOwerList(r.owers)}</div>
				</div>
			);
		});

		return (
			<div className="financesRoot">
				<div className="finances">
					<div className="paymentsRoot">
						<h1>Payments</h1>

						<div id="finances">{elements}</div>
					</div>

					<div className="requestsRoot">
						<h1>Requests</h1>

						<div id="requests">{requestElms}</div>
					</div>
				</div>

				<div className="returnToFridge">
					<Link to="/fridge">Return to Fridge</Link>
				</div>
			</div>
		);
	}
}

class Payment {
	constructor(buyer, owers, item, amount, paid) {
		this.buyer = buyer;
		this.owers = owers;
		this.amount = amount;
		this.item = item;
		this.paid = paid;
	}
}

class Request {
	constructor(owers, amount, item, paid) {
		this.owers = owers;
		this.amount = amount;
		this.item = item;
		this.paid = paid;
	}
}

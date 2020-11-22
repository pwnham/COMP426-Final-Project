import React from 'react';
import { Link } from 'react-router-dom';
import 'react-dropdown/style.css';

function Header() {
	return (
		<div className="header">
			<div className="logo">
				<p>icon</p>
				<h1>FridgeShare</h1>
			</div>

			<div className="leftHeader">
				<Link to="/calendar">View Group</Link>

				<div id="nav_menu">
                    <ul>
                        <li><button>username</button>
                            <ul>
                                <li><button>user info</button></li>
                                <li><button>logout</button></li>
                            </ul>
                        </li>
                    </ul>
                </div>
			</div>
            
		</div>
	);
}
export default Header;

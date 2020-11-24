import React, { Component } from "react";
import PropTypes from "prop-types";

let timer = null;

export class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: "",
    };
  }

  static defaultProperty = {
    suggestions: [],
  };
  static propTypes = {};

  onChange = (e) => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    console.log(suggestions);
    this.setState({ userInput: e.currentTarget.value });

    const filter = () => {
      const filteredSuggestions = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
      );

      console.log("filter", filteredSuggestions);

      this.setState({
        activeSuggestion: 0,
        filteredSuggestions,
        showSuggestions: true,
      });
      this.props.setParent(filteredSuggestions[this.state.activeSuggestion]);
    };

    clearTimeout(timer);
    timer = setTimeout(filter, 250);
  };

  onClick = (e) => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    });
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;
    let suggestionsListComponent;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul style={{ paddingLeft: 0 }} class="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              return (
                <li
                  class="form-control results"
                  key={suggestion}
                  onClick={onClick}
                >
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div class="no-suggestions">
            <em>No suggestions!</em>
          </div>
        );
      }
    }
    return (
      <>
        <style type="text/css">{`
.results:hover {
  background-color: #eee;
}
`}</style>
        <React.Fragment>
          <label class="form-label" for="groupName">
            Enter the name of the group you would like to join!
          </label>
          <input
            disabled={this.props.disabled}
            type="text"
            id="groupName"
            placeholder="Enter Group Name"
            autocomplete="off"
            class="form-control"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
          />
          {suggestionsListComponent}
        </React.Fragment>
      </>
    );
  }
}
export default Autocomplete;

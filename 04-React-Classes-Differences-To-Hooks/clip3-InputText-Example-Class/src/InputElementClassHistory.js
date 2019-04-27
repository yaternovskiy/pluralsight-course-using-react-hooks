class InputElementClassHistory extends React.Component {

  state = {
    inputText: "",
    historyList: []
  };

  handleChange = event => {
    const value = event.target.value;
    this.setState(previousState => {
      return {
        inputText: value,
        historyList: [...previousState.historyList, value]
      };
    });
  };

  render() {
    const { inputText, historyList } = this.props;

    return (
      <div>
        <input placeholder="Enter Some Text"
               onChange={this.handleChange} />
        <br />
        {inputText}
        <hr />
        <br />
        <ul>
          {historyList.map(rec => {
            return <div>{rec}</div>;
          })}
        </ul>
      </div>
    );
  }
}

export default InputElementClassHistory;

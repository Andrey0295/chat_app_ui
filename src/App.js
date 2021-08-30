import React, { Component } from "react";
// import MainPage from "./components/MainPage/MainPage";
import ConversationList from "./components/ConversationsList/ConversationsList";

class App extends Component {
  render() {
    return (
      <div>
        {/* <MainPage /> */}
        <ConversationList />
      </div>
    );
  }
}

export default App;

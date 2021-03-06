import React from "react";
import { ActionCableConsumer } from "react-actioncable-provider";

import { API_ROOT } from "../../constants/constants";

import NewConversationForm from "../NewConversationForm/NewConversationForm";
import MessagesArea from "../MessagesArea/MessagesArea";
import Cable from "../Cable/Cable";

import styles from "./ConversationList.module.css";

class ConversationsList extends React.Component {
  state = {
    conversations: [],
    activeConversation: null,
  };

  componentDidMount = () => {
    fetch(`${API_ROOT}/conversations`)
      .then((res) => res.json())
      .then((conversations) => this.setState({ conversations }));
  };

  handleClick = (id) => {
    this.setState({ activeConversation: id });
  };

  handleReceivedConversation = (response) => {
    const { conversation } = response;
    this.setState({
      conversations: [...this.state.conversations, conversation],
    });
  };

  handleReceivedMessage = (response) => {
    const { message } = response;
    const conversations = [...this.state.conversations];
    const conversation = conversations.find(
      (conversation) => conversation.id === message.conversation_id
    );
    conversation.messages = [...conversation.messages, message];
    this.setState({ conversations });
  };

  render = () => {
    const { conversations, activeConversation } = this.state;
    return (
      <div className="conversationsList">
        <ActionCableConsumer
          channel={{ channel: "ConversationsChannel" }}
          onReceived={this.handleReceivedConversation}
        >
          {this.state.conversations.length ? (
            <Cable
              conversations={conversations}
              handleReceivedMessage={this.handleReceivedMessage}
            />
          ) : null}
          <div>
            <h2 className={styles.ConversationTitle}>Conversations</h2>
            <ul className={styles.ConversationList}>
              {mapConversations(conversations, this.handleClick)}
            </ul>
            <NewConversationForm />
          </div>
          {activeConversation ? (
            <MessagesArea
              conversation={findActiveConversation(
                conversations,
                activeConversation
              )}
            />
          ) : null}
        </ActionCableConsumer>
      </div>
    );
  };
}

export default ConversationsList;

// helpers

const findActiveConversation = (conversations, activeConversation) => {
  return conversations.find(
    (conversation) => conversation.id === activeConversation
  );
};

const mapConversations = (conversations, handleClick) => {
  return conversations.map((conversation) => {
    return (
      <li
        className={styles.ConversationListItem}
        key={conversation.id}
        onClick={() => handleClick(conversation.id)}
      >
        {conversation.title}
      </li>
    );
  });
};

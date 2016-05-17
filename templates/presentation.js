import React, { Component } from 'react';
import Deck from "components/Deck.react";
import Slide from "components/Slide.react";
import Code from "components/Code.react";
import DocumentTitle from "react-document-title";

import "css/theme.css";

const TOPIC = 'Shower Presentation Engine';
const SPEAKER = (<span>Brought to you by <a href="http://pepelsbey.net">Vadim Makeev</a></span>)

export default () =>
  <DocumentTitle title={TOPIC}>
    <Deck>
      <header className="caption">
        <h1>{TOPIC}</h1>
        <p>{SPEAKER}</p>
      </header>
      <Slide className="cover-me">
        <h2>{TOPIC}</h2>
        <p>{SPEAKER}</p>
        <img src="https://shwr.me/pictures/cover.jpg" alt="" className="cover" />
      </Slide>
    </Deck>
  </DocumentTitle>

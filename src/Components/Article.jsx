import React from 'react';

function Article(props) {
  return (
    <div style={{ paddingTop: '50px', paddingRight: '50px', paddingBottom: '50px', paddingLeft: '50px' }}>
      <h1>{props.title}</h1>
      <h2>By {props.author}</h2>
    </div>
  );
}

export default Article;

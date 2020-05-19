var React = require('react');
 
function HelloMessage(props) {
   
  return (
  <div>
      <link rel="stylesheet" href="/css/index.css"/>
  <div>Hello {props.name}</div>
  </div>
  )
}
 
module.exports = HelloMessage;
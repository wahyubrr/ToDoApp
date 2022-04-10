import React from 'react';
import axios from 'axios';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    axios.get("http://localhost:8080/user")
      .then(res => {
        const users = res.data;
        this.setState({ users });
      })
  }

  render() {
    return (
      <div style={{ padding: "1rem 40px" }}>
        <h2>Users</h2>
        <ul>
          {this.state.users.map(user => {
            return (
              <li key={"Users"+user.UserId}>
                {user.UserId} - {user.FirstName} {user.LastName}
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

export default Users;
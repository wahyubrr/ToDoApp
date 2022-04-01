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
    axios.get("http://localhost:4000")
      .then(res => {
        const users = res.data;
        this.setState({ users });
        console.log(users);
      })
  }

  render() {
    return (
      <div style={{ padding: "1rem 0" }}>
        <h2>Users</h2>
        {this.state.users.map((userid, descriptions) => {
          // {userid}
          // {descriptions}
        })}
      </div>
    );
  }
}

export default Users;
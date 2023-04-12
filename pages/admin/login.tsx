import React from "react";
import Cookies from "cookies";
import { GetServerSideProps } from "next";
import { verify } from "../../controller/Auth";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);

  if ((await verify(cookies?.get("token"))) !== null)
    return {
      redirect: {
        permanent: false,
        destination: "/admin",
      },
    };

  return {
    props: {},
  };
};

class Login extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
    };

    this.login = this.login.bind(this);
  }

  async login(e) {
    e.preventDefault();
    const { username, password } = this.state;

    if (username === "" || password === "")
      return alert("Please fill in all the fields!");

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());

    if (res?.error) {
      alert(res.error);
    } else {
      window.location.href = "/admin";
    }
  }

  render() {
    return (
      <div>
        <h1>Login</h1>

        <form onSubmit={this.login}>
          <label htmlFor="username">Username:</label>
          <br />
          <input
            type="text"
            id="username"
            value={this.state.username}
            onChange={(e) => this.setState({ username: e.target.value })}
          />

          <br />
          <br />

          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
          />

          <br />
          <br />

          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default Login;

import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1>To Do App!</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
      >
        <Link to="/users">Users</Link> | {" "}
        <Link to ="/about">About</Link>
      </nav>
      <Outlet />
    </div>
  );
}

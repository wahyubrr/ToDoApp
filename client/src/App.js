import { Link, Outlet } from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <div>
      <Link to="/" className="nav-button"><h1>To Do App!</h1></Link>
      <nav className="navbar">
        <Link to="/users" className="nav-button">Users</Link> | {" "}
        <Link to ="/about" className="nav-button">About</Link>
      </nav>
      <h2>weee</h2>
      <Outlet />
    </div>
  );
}

import { useState } from "react";
// // import Login from "./pages/login";
// // import Signup from "./pages/signup";
// // import LandingPage from "./pages/LandingPage";
import ProjectCard from "./pages/ProjectCard";
// import Dashboard from "./pages/Dashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Dashboard /> */}
      <ProjectCard />
      {/* <LandingPage />
      <Login />
      <Signup />  */}
    </>
  );
}

export default App;

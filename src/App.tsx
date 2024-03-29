import "./index.css";
import Navbar from "./components/Navbar";
import SidePopup from "./components/SidePopup";
import { useState } from "react";

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const containerClasses = showPopup ? "relative brightness-50" : "relative";
  return (
    <>
      <div className={containerClasses}>
        <Navbar title="View Audience" />
        <div className="bg-white p-4 h-screen">
          <button
            className="bg-transparent text-blue py-2 px-4 border border-white-500"
            onClick={() => setShowPopup(true)}
          >
            Save Segment
          </button>
        </div>
      </div>
      {showPopup && (
        <div className="fixed top-0 right-0 h-full w-1/2 bg-white">
          <SidePopup popup={setShowPopup} />
        </div>
      )}
    </>
  );
}

export default App;

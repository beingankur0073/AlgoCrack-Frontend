// context/ProblemContext.jsx
import { createContext, useContext, useState } from "react";

const ProblemContext = createContext();

export const ProblemProvider = ({ children }) => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);

  return (
    <ProblemContext.Provider value={{ problems, setProblems, selectedProblem, setSelectedProblem }}>
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblems = () => useContext(ProblemContext);

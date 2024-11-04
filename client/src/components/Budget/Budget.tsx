import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchBudget } from "../../utils/budget-utils";

const Budget = () => {
  const {budget, setBudget} = useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);
  
  useEffect(() => {
    loadBudget();
    }, );
  
    // Function to load budget and handle errors
    const loadBudget = async () => {
    try {
      const fetchedBudget = await fetchBudget();
      setBudget(fetchedBudget);
    } catch (err: any) {
      console.log(err.message);
    }
    };

  const handleUpdate = () => {
    setBudget(newBudget);
    setEdit(false);
  }

  return (
    <div className="alert alert-secondary p-3 d-flex align-items-center justify-content-between">
      {edit ? (
        <div className = "d-flex align-items-center justify-content-between">
          <div>Budget: $</div>
          <input
            type="number"
            className="budget-control ms-3"
            placeholder="budget"
            value={newBudget}
            onChange={(event) => setNewBudget(parseFloat(event.target.value) || 0)}
          />
          <button type="submit" className="update change" onClick = {()=>handleUpdate()}>
            Update
          </button>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-between w-100">
          <div>Budget: ${budget}</div>
          <button className="edit" onClick={() => setEdit(true)}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
  
};

export default Budget;
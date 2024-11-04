import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('app interface', () => {
  render(<App />);
  const planner = screen.getByText('My Budget Planner');
  const expenses = screen.getByText('Expenses');
  const addExpense = screen.getByText('Add Expense');

  expect(planner).toBeInTheDocument();
  expect(expenses).toBeInTheDocument();
  expect(addExpense).toBeInTheDocument();

  const nameElement = screen.getByText('Name');
  const costElement = screen.getByText('Cost');
  const saveButton = screen.getByText('Save');

  expect(nameElement).toBeInTheDocument();
  expect(costElement).toBeInTheDocument();
  expect(saveButton).toBeInTheDocument();

  const budgetElement = screen.getByText("Budget: $1000");
  const remainingElement = screen.getByText("Remaining: $1000");
  const spentElement = screen.getByText("Spent so far: $0");

  expect(budgetElement).toBeInTheDocument();
  expect(remainingElement).toBeInTheDocument();
  expect(spentElement).toBeInTheDocument();
 
});


describe("Add expense", () => {
    test("Renders Add Expense Form", () => {
        render(<App />);
        const saveButton = screen.getByText("Save");
        expect(saveButton).toBeInTheDocument();
    });
    test("Add an expense", () => {
        render(<App />);

        const testName = "Test 1";
        const testCost = 500;

        const nameInput = screen.getByPlaceholderText("name");
        const costInput = screen.getByPlaceholderText("cost");
        const saveButton = screen.getByText("Save");
        fireEvent.change(nameInput, {target: {value: testName}});
        fireEvent.change(costInput, {target: {value: testCost}});
        fireEvent.click(saveButton);

        const checkAddedName = screen.getByText(testName);
        const checkAddedCost = screen.getByText(`$${testCost}`);
        const spentSoFar = screen.getByText("Spent so far: $" + testCost);
        const remaining = screen.getByText("Remaining: $" + (1000-testCost));
        expect(checkAddedCost).toBeInTheDocument();
        expect(checkAddedName).toBeInTheDocument();
        expect(spentSoFar).toBeInTheDocument();
        expect(remaining).toBeInTheDocument();
    });

});

describe("Delete an expense", () => {
  test("Delete an expense", () => {
      render(<App />);
      const testName1 = "Test 1";
      const testCost1 = 500;
      const testName2 = "Test 2";
      const testCost2 = 100;
      let spent = 0;
      let remaining = 1000; 

      const nameInput = screen.getByPlaceholderText("name");
      const costInput = screen.getByPlaceholderText("cost");
      const saveButton = screen.getByText("Save");
      
      //Add 2 expenses
      fireEvent.change(nameInput, {target: {value: testName1}});
      fireEvent.change(costInput, {target: {value: testCost1}});
      fireEvent.click(saveButton);

      fireEvent.change(nameInput, {target: {value: testName2}});
      fireEvent.change(costInput, {target: {value: testCost2}});
      fireEvent.click(saveButton);

      spent = testCost1 + testCost2;
      remaining = remaining - spent;

      //Check that the expenses are on display
      const checkAddedName1 = screen.getByText(testName1);
      const checkAddedCost1 = screen.getByText(`$${testCost1}`);
      const checkAddedName2 = screen.getByText(testName2);
      const checkAddedCost2 = screen.getByText(`$${testCost2}`);

      expect(checkAddedCost1).toBeInTheDocument();
      expect(checkAddedName1).toBeInTheDocument();
      expect(checkAddedCost2).toBeInTheDocument();
      expect(checkAddedName2).toBeInTheDocument();

      //Click on x button to delete the expense "Test 1"
      const xButton1 = screen.getAllByText("x")[0];
      fireEvent.click(xButton1);
      spent = spent - testCost1;
      remaining = remaining + testCost1;

      //Check that only "Test 1" is deleted.
      const deletedName = screen.queryByText(testName1);
      const deletedCost = screen.queryByText(`$${testCost1}`);
      expect(deletedName).not.toBeInTheDocument();
      expect(deletedCost).not.toBeInTheDocument();

      //Check that "Test 2" is still in the list
      expect(screen.getByText(`$${testCost2}`)).toBeInTheDocument();
      expect(screen.getByText(testName2)).toBeInTheDocument();

      const spentSoFar = screen.getByText(`Spent so far: $${spent}`);
      const remainingDisplay = screen.getByText(`Remaining: $${remaining}`);
      expect(spentSoFar).toBeInTheDocument();
      expect(remainingDisplay).toBeInTheDocument();    
  });
});


describe("Budget Balance Verification", () => {
  test("Verify budget after adding 1 expense", () => {
      render(<App />);
      const testName1 = "Test 1";
      const testCost1 = 500;
      const budget = 1000;

      const nameInput = screen.getByPlaceholderText("name");
      const costInput = screen.getByPlaceholderText("cost");
      const saveButton = screen.getByText("Save");
      
      //Add 2 expenses
      fireEvent.change(nameInput, {target: {value: testName1}});
      fireEvent.change(costInput, {target: {value: testCost1}});
      fireEvent.click(saveButton);

      const remainingSlot = screen.getByText(/^Remaining:/).textContent;
      const remainingDollarMatch = remainingSlot?.match(/\$(\d+)/);
      const remainingDollar = remainingDollarMatch ? parseFloat(remainingDollarMatch[1]) : 0;
      const spentSlot = screen.getByText(/^Spent so far/).textContent;
      const spentDollarMatch = spentSlot?.match(/\$(\d+)/);
      const spentDollar = spentDollarMatch ? parseFloat(spentDollarMatch[1]) : 0;
      const total = spentDollar + remainingDollar;
      expect(total).toBe(budget);
 
  });

  test("Verify budget after adding 2 expenses", () => {
    render(<App />);
    const testName1 = "Test 1";
    const testCost1 = 500;
    const testName2 = "Test 2";
    const testCost2 = 100;
    const budget = 1000;

    const nameInput = screen.getByPlaceholderText("name");
    const costInput = screen.getByPlaceholderText("cost");
    const saveButton = screen.getByText("Save");
    
    //Add 2 expenses
    //Add the first expense
    fireEvent.change(nameInput, {target: {value: testName1}});
    fireEvent.change(costInput, {target: {value: testCost1}});
    fireEvent.click(saveButton);
    //Add the second expense
    fireEvent.change(nameInput, {target: {value: testName2}});
    fireEvent.change(costInput, {target: {value: testCost2}});
    fireEvent.click(saveButton);
    
    const remainingSlot = screen.getByText(/^Remaining:/).textContent;
    const remainingDollarMatch = remainingSlot?.match(/\$(\d+)/);
    const remainingDollar = remainingDollarMatch ? parseFloat(remainingDollarMatch[1]) : 0;
    const spentSlot = screen.getByText(/^Spent so far/).textContent;
    const spentDollarMatch = spentSlot?.match(/\$(\d+)/);
    const spentDollar = spentDollarMatch ? parseFloat(spentDollarMatch[1]) : 0;
    const total = spentDollar + remainingDollar;
    expect(total).toBe(budget);
  });

  test("Verify budget after adding 2 expenses and deleting 1 of them", () => {
    render(<App />);
    const testName1 = "Test 1";
    const testCost1 = 500;
    const testName2 = "Test 2";
    const testCost2 = 100;
    const budget = 1000;

    const nameInput = screen.getByPlaceholderText("name");
    const costInput = screen.getByPlaceholderText("cost");
    const saveButton = screen.getByText("Save");
    
    //Add 2 expenses
    fireEvent.change(nameInput, {target: {value: testName1}});
    fireEvent.change(costInput, {target: {value: testCost1}});
    fireEvent.click(saveButton);

    fireEvent.change(nameInput, {target: {value: testName2}});
    fireEvent.change(costInput, {target: {value: testCost2}});
    fireEvent.click(saveButton);

    //Click on x button to delete the expense "Test 1"
    const xButton1 = screen.getAllByText("x")[0];
    fireEvent.click(xButton1);

    //Check if remaining + spent so far === budget?
    const remainingSlot = screen.getByText(/^Remaining:/).textContent;
    const remainingDollarMatch = remainingSlot?.match(/\$(\d+)/);
    const remainingDollar = remainingDollarMatch ? parseFloat(remainingDollarMatch[1]) : 0;
    const spentSlot = screen.getByText(/^Spent so far/).textContent;
    const spentDollarMatch = spentSlot?.match(/\$(\d+)/);
    const spentDollar = spentDollarMatch ? parseFloat(spentDollarMatch[1]) : 0;
    const total = spentDollar + remainingDollar;
    expect(spentDollar).toBe(budget); // total   
  });
  
  test("Verify budget after editing budget", () => {
    render(<App />);
    const testName1 = "Test 1";
    const testCost1 = 500;

    const budget = 1000;
    //Check if the orginal budget is $1000
    expect(screen.getByText(`Budget: $${budget}`)).toBeInTheDocument();
    const newBudget = 10000;

    const nameInput = screen.getByPlaceholderText("name");
    const costInput = screen.getByPlaceholderText("cost");
    const saveButton = screen.getByText("Save");
    const editButton = screen.getByText("Edit");

    //Add an expense
    fireEvent.change(nameInput, {target: {value: testName1}});
    fireEvent.change(costInput, {target: {value: testCost1}});
    fireEvent.click(saveButton);

    //Edit budget
    fireEvent.click(editButton);
    const updateInput = screen.getByPlaceholderText("budget");
    fireEvent.change(updateInput, {target: {value: newBudget}});
    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);

    //Check if the new budget is updated
    expect(screen.getByText(`Budget: $${newBudget}`)).toBeInTheDocument();

    //Check if remaining + spent so far === budget?
    const remainingSlot = screen.getByText(/^Remaining:/).textContent;
    const remainingDollarMatch = remainingSlot?.match(/\$(\d+)/);
    const remainingDollar = remainingDollarMatch ? parseFloat(remainingDollarMatch[1]) : 0;
    const spentSlot = screen.getByText(/^Spent so far/).textContent;
    const spentDollarMatch = spentSlot?.match(/\$(\d+)/);
    const spentDollar = spentDollarMatch ? parseFloat(spentDollarMatch[1]) : 0;
    const total = spentDollar + remainingDollar;
    expect(total).toBe(newBudget);    
  });
});
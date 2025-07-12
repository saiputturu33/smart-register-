 
// staƟc/script.js
// Global state variables
let inventory = [];
let totalProfit = 0;
let totalLoss = 0;
let ediƟngItemId = null; // To keep track of the item being edited
// DOM Elements
// NavigaƟon
const navAddItemBtn = document.getElementById('navAddItem');
const navInventoryViewBtn = document.getElementById('navInventoryView');
const navStockModificaƟonBtn = document.getElementById('navStockModificaƟon');
const navBuƩons = document.querySelectorAll('.nav-buƩon');
// Screens
const addItemScreen = document.getElementById('addItemScreen');
const inventoryViewScreen = document.getElementById('inventoryViewScreen');
const stockModificaƟonScreen = document.getElementById('stockModificaƟonScreen');
// Add Item Screen Elements
const itemForm = document.getElementById('itemForm');
const itemIdInput = document.getElementById('itemId');
const itemNameInput = document.getElementById('itemName');
const itemQuanƟtyInput = document.getElementById('itemQuanƟty');
const itemPriceInput = document.getElementById('itemPrice'); // Now "Cost Price"
const saveItemBtn = document.getElementById('saveItemBtn');
const clearFormBtn = document.getElementById('clearFormBtn');
// Inventory View Screen Elements
const totalUniqueItemsDisplay = document.getElementById('totalUniqueItems');
const totalQuanƟtyDisplay = document.getElementById('totalQuanƟty');
const totalValuaƟonDisplay = document.getElementById('totalValuaƟon');
const inventorySearchBar = document.getElementById('inventorySearchBar');
const inventoryList = document.getElementById('inventoryList');
const noItemsMessage = document.getElementById('noItemsMessage');
// Stock ModificaƟon Screen Elements
const stockModificaƟonForm = document.getElementById('stockModificaƟonForm');
const modifyItemIdSelect = document.getElementById('modifyItemId');
const modifyQuanƟtyInput = document.getElementById('modifyQuanƟty');
const reasonSaleRadio = document.getElementById('reasonSale');
const reasonDamageRadio = document.getElementById('reasonDamage');
const salePriceContainer = document.getElementById('salePriceContainer');
const salePriceInput = document.getElementById('salePrice');
const totalProfitDisplay = document.getElementById('totalProfitDisplay');
const totalLossDisplay = document.getElementById('totalLossDisplay');
// Global Message Box
const globalMessageBox = document.getElementById('globalMessageBox');
/**
 * Shows a message in the global message box.
 * @param {string} message - The message to display.
 * @param {string} type - 'success', 'error', or 'info' to determine styling.
 */
funcƟon showMessage(message, type) {
 globalMessageBox.textContent = message;
 globalMessageBox.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red100', 'text-red-800', 'bg-blue-100', 'text-blue-800');
 if (type === 'success') {
 globalMessageBox.classList.add('bg-green-100', 'text-green-800');
 } else if (type === 'error') {
 globalMessageBox.classList.add('bg-red-100', 'text-red-800');
 } else if (type === 'info') {
 globalMessageBox.classList.add('bg-blue-100', 'text-blue-800');
 }
 globalMessageBox.classList.remove('hidden');
 setTimeout(() => {
 globalMessageBox.classList.add('hidden');
 }, 3000); // Hide aŌer 3 seconds
}
/**
 * Saves the current inventory, total profit, and total loss to local storage.
 */
funcƟon saveState() {
 try {
 localStorage.setItem('inventory', JSON.stringify(inventory));
 localStorage.setItem('totalProfit', totalProfit.toFixed(2));
 localStorage.setItem('totalLoss', totalLoss.toFixed(2));
 } catch (e) {
 console.error("Error saving to local storage:", e);
 showMessage("Error saving data locally.", 'error');
 }
}
/**
 * Loads inventory, total profit, and total loss data from local storage.
 */
funcƟon loadState() {
 try {
 const storedInventory = localStorage.getItem('inventory');
 if (storedInventory) {
 inventory = JSON.parse(storedInventory);
 }
 const storedProfit = localStorage.getItem('totalProfit');
 if (storedProfit) {
 totalProfit = parseFloat(storedProfit);
 }
 const storedLoss = localStorage.getItem('totalLoss');
 if (storedLoss) {
 totalLoss = parseFloat(storedLoss);
 }
 } catch (e) {
 console.error("Error loading from local storage:", e);
 showMessage("Error loading data from local storage.", 'error');
 }
}
/**
 * Renders the inventory items to the table on the Inventory View screen.
 * @param {Array} itemsToDisplay - The array of items to render (can be filtered).
 */
funcƟon renderInventory(itemsToDisplay = inventory) {
 inventoryList.innerHTML = ''; // Clear exisƟng list
 if (itemsToDisplay.length === 0) {
 noItemsMessage.classList.remove('hidden');
 return;
 } else {
 noItemsMessage.classList.add('hidden');
 }
 itemsToDisplay.forEach(item => {
 const row = document.createElement('tr');
 row.className = 'hover:bg-gray-50 transiƟon duraƟon-150 ease-in-out';
 row.innerHTML = `
 <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray900">${item.id}</td>
 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.name}</td>
 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray700">${item.quanƟty}</td>
 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray700">₹${item.price.toFixed(2)}</td>
 <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
 <buƩon onclick="editItem('${item.id}')"
 class="text-blue-600 hover:text-blue-900 mr-3 px-3 py-1 rounded-md bg-blue100 hover:bg-blue-200 transiƟon duraƟon-150 ease-in-out">
 Edit
 </buƩon>
 <buƩon onclick="deleteItem('${item.id}')"
 class="text-red-600 hover:text-red-900 px-3 py-1 rounded-md bg-red-100
hover:bg-red-200 transiƟon duraƟon-150 ease-in-out">
 Delete
 </buƩon>
 </td>
 `;
 inventoryList.appendChild(row);
 });
}
/**
 * Calculates and displays overall inventory metrics.
 */
funcƟon updateInventoryMetrics() {
 const totalUnique = inventory.length;
 const totalQty = inventory.reduce((sum, item) => sum + item.quanƟty, 0);
 const totalVal = inventory.reduce((sum, item) => sum + (item.quanƟty * item.price), 0);
 totalUniqueItemsDisplay.textContent = totalUnique;
 totalQuanƟtyDisplay.textContent = totalQty;
 totalValuaƟonDisplay.textContent = `₹${totalVal.toFixed(2)}`;
}
/**
* Populates the item selecƟon dropdown on the Stock ModificaƟon screen.
 */
funcƟon populateModifyItemSelect() {
 modifyItemIdSelect.innerHTML = '<opƟon value="">-- Select an item --</opƟon>'; // Clear
exisƟng opƟons
 inventory.forEach(item => {
 const opƟon = document.createElement('opƟon');
 opƟon.value = item.id;
 opƟon.textContent = `${item.name} (ID: ${item.id}, Qty: ${item.quanƟty}, Cost:
₹${item.price.toFixed(2)})`;
 modifyItemIdSelect.appendChild(opƟon);
 });
}
/**
 * Updates the profit and loss displays.
 */
funcƟon updateFinancialSummary() {
 totalProfitDisplay.textContent = `₹${totalProfit.toFixed(2)}`;
 totalLossDisplay.textContent = `₹${totalLoss.toFixed(2)}`;
}
/**
 * Handles screen switching logic.
 * @param {string} screenId - The ID of the screen to show.
 */
funcƟon showScreen(screenId) {
 // Hide all screens
 document.querySelectorAll('.screen').forEach(screen => {
 screen.classList.remove('acƟve');
 });
 // DeacƟvate all nav buƩons
 navBuƩons.forEach(buƩon => {
 buƩon.classList.remove('acƟve');
 });
 // Show the selected screen and acƟvate its nav buƩon
 document.getElementById(screenId).classList.add('acƟve');
 if (screenId === 'addItemScreen') navAddItemBtn.classList.add('acƟve');
 if (screenId === 'inventoryViewScreen') {
 navInventoryViewBtn.classList.add('acƟve');
 renderInventory(); // Re-render inventory when this screen is acƟve
 updateInventoryMetrics(); // Update metrics when this screen is acƟve
 inventorySearchBar.value = ''; // Clear search bar on screen switch
 }
 if (screenId === 'stockModificaƟonScreen') {
 navStockModificaƟonBtn.classList.add('acƟve');
 populateModifyItemSelect(); // Populate dropdown when this screen is acƟve
 updateFinancialSummary(); // Update financial summary
 modifyQuanƟtyInput.value = ''; // Clear quanƟty input
 reasonSaleRadio.checked = true; // Default to sale
 toggleSalePriceInput(); // Show/hide sale price input
 }
 clearForm(); // Clear the add/edit form when switching screens
}
// Event Listeners for NavigaƟon
navAddItemBtn.addEventListener('click', () => showScreen('addItemScreen'));
navInventoryViewBtn.addEventListener('click', () => showScreen('inventoryViewScreen'));
navStockModificaƟonBtn.addEventListener('click', () =>
showScreen('stockModificaƟonScreen'));
/**
 * Handles the submission of the item form (add or edit).
 * @param {Event} event - The form submission event.
 */
itemForm.addEventListener('submit', funcƟon(event) {
 event.preventDefault(); // Prevent default form submission
 const id = itemIdInput.value.trim();
 const name = itemNameInput.value.trim();
 const quanƟty = parseInt(itemQuanƟtyInput.value);
 const price = parseFloat(itemPriceInput.value);
 // Basic validaƟon
 if (!id || !name || isNaN(quanƟty) || quanƟty < 0 || isNaN(price) || price < 0) {
 showMessage('Please fill in all fields with valid posiƟve values.', 'error');
 return;
 }
 if (ediƟngItemId) {
 // EdiƟng exisƟng item
 const itemIndex = inventory.findIndex(item => item.id === ediƟngItemId);
 if (itemIndex !== -1) {
 // Check if ID was changed and if new ID is unique
 if (ediƟngItemId !== id && inventory.some(item => item.id === id)) {
 showMessage('Item ID already exists. Please use a unique ID.', 'error');
 return;
 }
 inventory[itemIndex].id = id; // Update ID if changed
 inventory[itemIndex].name = name;
 inventory[itemIndex].quanƟty = quanƟty;
 inventory[itemIndex].price = price;
 showMessage('Item updated successfully!', 'success');
 }
 ediƟngItemId = null; // Reset ediƟng state
 saveItemBtn.textContent = 'Add Item'; // Change buƩon back
 itemIdInput.removeAƩribute('readonly'); // Make ID editable again
 } else {
 // Adding new item
 // Check for unique ID when adding a new item
 if (inventory.some(item => item.id === id)) {
 showMessage('Item ID already exists. Please use a unique ID.', 'error');
 return;
 }
 const newItem = {
 id: id,
 name: name,
 quanƟty: quanƟty,
 price: price // This is the cost price
 };
 inventory.push(newItem);
 showMessage('Item added successfully!', 'success');
 }
 clearForm();
 saveState();
 renderInventory(); // Re-render the full inventory (in case we switch back)
 updateInventoryMetrics(); // Update metrics
 populateModifyItemSelect(); // Update dropdown
});
/**
* Clears the form fields on the Add Item screen and resets ediƟng state.
 */
funcƟon clearForm() {
 itemIdInput.value = '';
 itemNameInput.value = '';
 itemQuanƟtyInput.value = '';
 itemPriceInput.value = '';
 ediƟngItemId = null;
 saveItemBtn.textContent = 'Add Item';
 itemIdInput.removeAƩribute('readonly'); // Ensure ID is editable for new entries
 itemNameInput.focus(); // Focus on the first input field
}
// Event listener for the clear form buƩon
clearFormBtn.addEventListener('click', clearForm);
/**
 * Populates the form with data of an item to be edited.
 * @param {string} id - The ID of the item to edit.
 */
funcƟon editItem(id) {
 const itemToEdit = inventory.find(item => item.id === id);
 if (itemToEdit) {
 itemIdInput.value = itemToEdit.id;
 itemNameInput.value = itemToEdit.name;
 itemQuanƟtyInput.value = itemToEdit.quanƟty;
 itemPriceInput.value = itemToEdit.price;
 ediƟngItemId = id;
 saveItemBtn.textContent = 'Update Item';
 itemIdInput.setAƩribute('readonly', 'true'); // Make ID read-only during edit
 showScreen('addItemScreen'); // Switch to add item screen
 itemNameInput.focus(); // Focus on the name input for quick ediƟng
 showMessage(`EdiƟng item: ${itemToEdit.name}`, 'info');
 }
}
/**
 * Deletes an item from the inventory.
 * @param {string} id - The ID of the item to delete.
 */
funcƟon deleteItem(id) {
 const iniƟalLength = inventory.length;
 const deletedItem = inventory.find(item => item.id === id);
 inventory = inventory.filter(item => item.id !== id);
 if (inventory.length < iniƟalLength) {
 showMessage(`Item "${deletedItem ? deletedItem.name : id}" deleted successfully!`,
'success');
 } else {
 showMessage('Item not found!', 'error');
 }
 saveState();
 renderInventory(); // Re-render the full inventory
 updateInventoryMetrics(); // Update metrics
 populateModifyItemSelect(); // Update dropdown
 clearForm(); // Clear the form if the deleted item was being edited
}
/**
 * Filters inventory items based on search input on the Inventory View screen.
 */
inventorySearchBar.addEventListener('input', funcƟon() {
 const searchTerm = inventorySearchBar.value.toLowerCase().trim();
 const filteredItems = inventory.filter(item =>
 item.name.toLowerCase().includes(searchTerm) ||
 item.id.toLowerCase().includes(searchTerm)
 );
 renderInventory(filteredItems);
});
/**
 * Toggles the visibility of the sale price input based on the selected reason.
 */
funcƟon toggleSalePriceInput() {
 if (reasonSaleRadio.checked) {
 salePriceContainer.classList.remove('hidden');
 salePriceInput.setAƩribute('required', 'true');
 // Set default sale price to item's cost price when selected item changes
 const selectedItem = inventory.find(item => item.id === modifyItemIdSelect.value);
 if (selectedItem) {
 salePriceInput.value = selectedItem.price.toFixed(2);
 } else {
 salePriceInput.value = '';
 }
 } else {
 salePriceContainer.classList.add('hidden');
 salePriceInput.removeAƩribute('required');
 salePriceInput.value = '';
 }
}
// Event listeners for reason radio buƩons
reasonSaleRadio.addEventListener('change', toggleSalePriceInput);
reasonDamageRadio.addEventListener('change', toggleSalePriceInput);
// Event listener for item selecƟon change to update default sale price
modifyItemIdSelect.addEventListener('change', toggleSalePriceInput);
/**
* Handles the submission of the stock modificaƟon form.
 * @param {Event} event - The form submission event.
 */
stockModificaƟonForm.addEventListener('submit', funcƟon(event) {
 event.preventDefault();
 const selectedItemId = modifyItemIdSelect.value;
 const quanƟtyChange = parseInt(modifyQuanƟtyInput.value);
 const changeReason =
document.querySelector('input[name="changeReason"]:checked').value;
 const salePrice = parseFloat(salePriceInput.value);
 if (!selectedItemId) {
 showMessage('Please select an item.', 'error');
 return;
 }
 if (isNaN(quanƟtyChange) || quanƟtyChange <= 0) {
 showMessage('Please enter a valid posiƟve quanƟty.', 'error');
 return;
 }
 if (changeReason === 'sale' && (isNaN(salePrice) || salePrice < 0)) {
 showMessage('Please enter a valid sale price.', 'error');
 return;
 }
 const itemToModify = inventory.find(item => item.id === selectedItemId);
 if (!itemToModify) {
 showMessage('Selected item not found.', 'error');
 return;
 }
 if (quanƟtyChange > itemToModify.quanƟty) {
 showMessage('Cannot change more than available quanƟty.', 'error');
 return;
 }
 // Perform stock modificaƟon
 itemToModify.quanƟty -= quanƟtyChange;
 if (changeReason === 'sale') {
 // Profit/Loss = (Sale Price - Cost Price) * QuanƟty
 const itemCostPrice = itemToModify.price;
 const profitLossPerUnit = salePrice - itemCostPrice;
 const transacƟonProfitLoss = profitLossPerUnit * quanƟtyChange;
 if (transacƟonProfitLoss >= 0) {
 totalProfit += transacƟonProfitLoss;
 showMessage(`Sold ${quanƟtyChange} of ${itemToModify.name} for
₹${salePrice.toFixed(2)} each. Profit: ₹${transacƟonProfitLoss.toFixed(2)}`, 'success');
 } else {
 totalLoss += Math.abs(transacƟonProfitLoss);
 showMessage(`Sold ${quanƟtyChange} of ${itemToModify.name} for
₹${salePrice.toFixed(2)} each. Loss: ₹${Math.abs(transacƟonProfitLoss).toFixed(2)}`, 'info');
 }
 } else if (changeReason === 'damage') {
 totalLoss += (quanƟtyChange * itemToModify.price); // Loss is based on cost price
 showMessage(`Logged ${quanƟtyChange} of ${itemToModify.name} as damaged. Loss:
₹${(quanƟtyChange * itemToModify.price).toFixed(2)}`, 'info');
 }
 // Remove item if quanƟty drops to 0 or below
 if (itemToModify.quanƟty <= 0) {
 inventory = inventory.filter(item => item.id !== selectedItemId);
 showMessage(`${itemToModify.name} quanƟty reached zero and was removed from
inventory.`, 'info');
 }
 saveState();
 populateModifyItemSelect(); // Re-populate dropdown to reflect new quanƟƟes or
removed items
 updateFinancialSummary(); // Update profit/loss display
 updateInventoryMetrics(); // Update overall inventory metrics
 renderInventory(); // Re-render inventory table if acƟve
 modifyQuanƟtyInput.value = ''; // Clear the quanƟty input aŌer successful modificaƟon
 salePriceInput.value = ''; // Clear sale price input
});
// IniƟal load and render when the page loads
document.addEventListener('DOMContentLoaded', () => {
 loadState();
 showScreen('addItemScreen'); // Show the Add Item screen by default
});

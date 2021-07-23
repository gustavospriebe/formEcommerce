"use strict";

const openModal = () =>
    document.getElementById("modal").classList.add("active");

const closeModal = () => {
    clearFields();
    document.getElementById("modal").classList.remove("active");
};

const getLocalStorage = () =>
    JSON.parse(localStorage.getItem("db_client")) ?? [];

const setLocalStorage = (dbClient) =>
    localStorage.setItem("db_client", JSON.stringify(dbClient));

// CRUD - Create read update delete
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
};

const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
};

const readClient = () => getLocalStorage();

const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStorage(dbClient);
};

const isValidFields = () => {
    return document.getElementById("form").reportValidity();
};

const CancelProduct = () => {
    closeModal();
};

// Interação com o layout
const clearFields = () => {
    const fields = document.querySelectorAll(".modal-field");
    fields.forEach((field) => (field.value = ""));
};

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            name: document.getElementById("name").value,
            category: document.getElementById("category").value,
            amount: document.getElementById("amount").value,
            price: document.getElementById("price").value,
        };
        const index = document.getElementById("name").dataset.index;
        if (index == "new") {
            createClient(client);
            updateTable();
            closeModal();
        } else {
            updateClient(index, client);
            updateTable();
            closeModal();
        }
    }
};

const createRow = (client, index) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${client.name}</td>
        <td>${client.category}</td>
        <td>${client.amount}</td>
        <td>${client.price}</td>
        <td>
            <button type="button" class="action green" id="edit-${index}">Editar</button>
            <button type="button" class="action red" id="delete-${index}">Excluir</button>
        </td>
    `;
    document.querySelector("#product-table>tbody").appendChild(newRow);
};

const clearTable = () => {
    const rows = document.querySelectorAll("#product-table>tbody tr");
    rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
};

const fillFields = (client) => {
    document.getElementById("name").value = client.name;
    document.getElementById("category").value = client.category;
    document.getElementById("amount").value = client.amount;
    document.getElementById("price").value = client.price;
    document.getElementById("name").dataset.index = client.index;
};

const editClient = (index) => {
    const client = readClient()[index];
    client.index = index;
    fillFields(client);
    openModal();
};

const editDelete = (event) => {
    if (event.target.type == "button") {
        const [action, index] = event.target.id.split("-");

        if (action == "edit") {
            editClient(index);
        } else {
            const client = readClient()[index];
            const response = confirm(
                `Deseja realmente excluir o cliente ${client.name}`
            );
            if (response) {
                deleteClient(index);
                updateTable();
            }
        }
    }
};

updateTable();

// Eventos
document.getElementById("registerProduct").addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("save").addEventListener("click", saveClient);

document.getElementById("cancel").addEventListener("click", closeModal);

document
    .querySelector("#product-table>tbody")
    .addEventListener("click", editDelete);

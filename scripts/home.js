let empPayrollList;
window.addEventListener("DOMContentLoaded", () => {
  if (siteProperties.useLocalStorage.match("true")) {
    getEmployeePayrollDataFromStorage();
  } else getEmployeePayrollDataFromServer();
});

const getEmployeePayrollDataFromStorage = () => {
  empPayrollList = localStorage.getItem("EmployeePayrollList")
    ? JSON.parse(localStorage.getItem("EmployeePayrollList"))
    : [];
  processEmployeePayrollDataResponse();
};

const processEmployeePayrollDataResponse = () => {
  document.querySelector(".emp-count").textContent = empPayrollList.length;
  createInnerHtml();
  localStorage.removeItem("editEmp");
};

const getEmployeePayrollDataFromServer = () => {
  makeServiceCall("GET", siteProperties.serverUrl, true)
    .then((responseText) => {
      empPayrollList = JSON.parse(responseText);
      processEmployeePayrollDataResponse();
    })
    .catch(() => {
      empPayrollList = [];
      processEmployeePayrollDataResponse();
    });
};

const createInnerHtml = () => {
  if (empPayrollList.length === 0) return;
  const headerHtml = `
  <tr>
    <th></th>
    <th>Name</th>
    <th>Gender</th>
    <th>Department</th>
    <th>Salary</th>
    <th>Start Date</th>
    <th>Actions</th>
  </tr>
`;
  let innerHtml = `${headerHtml}`;

  for (const empPayrollData of empPayrollList) {
    innerHtml = `${innerHtml}
    
      <tr>
        <td>
          <img class="profile" src="${empPayrollData._profilePic}" alt="" />
        </td>
        <td>${empPayrollData._name}</td>
        <td>${empPayrollData._gender}</td>
        <td>${getDeptHtml(empPayrollData._department)}</td>
        <td>${empPayrollData._salary}</td>
        <td>${stringifyDate(empPayrollData._startDate)}</td>
        <td>
          <img
            id="${empPayrollData.id}" onclick="remove(this)"
            src="./images/icons/delete-black-18dp.svg"
            alt="delete"
          />
          <img
            id="${empPayrollData.id}" onclick="update(this)"
            src="./images/icons/create-black-18dp.svg"
            alt="edit"
          />
        </td>
      </tr>
    `;
  }

  document.querySelector("#table-display").innerHTML = innerHtml;
};

const getDeptHtml = (deptList) => {
  let deptHtml = "";
  for (const dept of deptList) {
    deptHtml = `${deptHtml} <div class="dept-label">${dept}</div>`;
  }
  return deptHtml;
};

const remove = (node) => {
  let empPayrollData = empPayrollList.find((empData) => empData.id == node.id);
  if (!empPayrollData) return;
  const index = empPayrollList
    .map((empData) => empData.id)
    .indexOf(empPayrollData.id);
  empPayrollList.splice(index, 1);
  if (siteProperties.useLocalStorage.match("true")) {
    localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
    createInnerHtml();
  } else {
    const deleteUrl = siteProperties.serverUrl + empPayrollData.id.toString();
    makeServiceCall("DELETE", deleteUrl, true)
      .then(() => {
        document.querySelector(".emp-count").textContent =
          empPayrollList.length;
        createInnerHtml();
      })
      .catch((error) => {
        console.log("DELETE error status: " + JSON.stringify(error));
      });
  }
};

const update = (node) => {
  let empPayrollData = empPayrollList.find((empData) => empData.id == node.id);

  if (!empPayrollData) return;

  localStorage.setItem("editEmp", JSON.stringify(empPayrollData));
  window.location.replace(siteProperties.form);
};

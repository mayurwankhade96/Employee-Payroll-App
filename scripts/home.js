let empPayrollList;
window.addEventListener("DOMContentLoaded", (event) => {
  empPayrollList = getEmployeePayrollDataFromStorage();
  document.querySelector(".emp-count").textContent = empPayrollList.length;
  createInnerHtml();
  localStorage.removeItem("editEmp");
});

const getEmployeePayrollDataFromStorage = () => {
  return localStorage.getItem("EmployeePayrollList")
    ? JSON.parse(localStorage.getItem("EmployeePayrollList"))
    : [];
};

const createInnerHtml = () => {
  if (empPayrollList.length === 0) return;
  const headerHtml = `<thead>
  <tr>
    <th></th>
    <th>Name</th>
    <th>Gender</th>
    <th>Department</th>
    <th>Salary</th>
    <th>Start Date</th>
    <th>Actions</th>
  </tr>
</thead>`;
  let innerHtml = `${headerHtml}`;

  for (const empPayrollData of empPayrollList) {
    innerHtml = `${innerHtml}
    <tbody>
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
            id="${empPayrollData._id}" onclick="remove(this)"
            src="./images/icons/delete-black-18dp.svg"
            alt="delete"
          />
          <img
            id="${empPayrollData._id}" onclick="update(this)"
            src="./images/icons/create-black-18dp.svg"
            alt="edit"
          />
        </td>
      </tr>
    </tbody>`;
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
  let empPayrollData = empPayrollList.find((empData) => empData._id == node.id);

  if (!empPayrollData) return;

  const index = empPayrollList
    .map((empData) => empData._id)
    .indexOf(empPayrollData._id);

  empPayrollList.splice(index, 1);

  localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
  document.querySelector(".emp-count").textContent = empPayrollList.length;
  createInnerHtml();
};

const update = (node) => {
  let empPayrollData = empPayrollList.find((empData) => empData._id == node.id);

  if (!empPayrollData) return;

  localStorage.setItem("editEmp", JSON.stringify(empPayrollData));
  window.location.replace(siteProperties.form);
};

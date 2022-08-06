let isUpdate = false;
let employeePayrollObj = {};

window.addEventListener("DOMContentLoaded", (event) => {
  const name = document.querySelector("#name");
  name.addEventListener("input", function () {
    if (name.value.length === 0) {
      setTextValue(".text-error", "");
      return;
    }
    try {
      new EmployeePayrollData().name = name.value;
      setTextValue(".text-error", "");
    } catch (e) {
      setTextValue(".text-error", e);
    }
  });

  const date = document.querySelector("#date");
  date.addEventListener("input", function () {
    let startDate =
      getInputValueById("#day") +
      " " +
      getInputValueById("#month") +
      " " +
      getInputValueById("#year");

    try {
      new EmployeePayrollData().startDate = new Date(Date.parse(startDate));
      setTextValue(".date-error", "");
    } catch (e) {
      setTextValue(".date-error", e);
    }
  });

  const salary = document.querySelector("#salary");
  const salaryOutput = document.querySelector(".salary-output");
  salaryOutput.textContent = salary.value;
  salary.addEventListener("input", function () {
    salaryOutput.textContent = salary.value;
  });

  checkForUpdate();
});

const save = (event) => {
  event.preventDefault();
  event.stopPropagation();
  try {
    setEmployeePayrollObject();
    createAndUpdateStorage();
    resetForm();
    window.location.replace(siteProperties.homePage);
  } catch (e) {
    console.log(e);
    return;
  }
};

const setEmployeePayrollObject = () => {
  employeePayrollObj._name = getInputValueById("#name");
  employeePayrollObj._profilePic = getSelectedValues("[name=profile]").pop();
  employeePayrollObj._gender = getSelectedValues("[name=gender]").pop();
  employeePayrollObj._department = getSelectedValues("[name=department]");
  employeePayrollObj._salary = getInputValueById("#salary");
  employeePayrollObj._note = getInputValueById("#notes");
  let date =
    getInputValueById("#day") +
    " " +
    getInputValueById("#month") +
    " " +
    getInputValueById("#year");
  employeePayrollObj._startDate = date;
};

const createAndUpdateStorage = () => {
  let employeePayrollList = JSON.parse(
    localStorage.getItem("EmployeePayrollList")
  );
  if (employeePayrollList) {
    let empPayrollData = employeePayrollList.find((empData) => {
      return empData._id === employeePayrollObj._id;
    });
    if (!empPayrollData) {
      employeePayrollList.push(createEmployeePayrollData());
    } else {
      const index = employeePayrollList
        .map((empData) => empData._id)
        .indexOf(empPayrollData._id);
      employeePayrollList.splice(
        index,
        1,
        createEmployeePayrollData(empPayrollData._id)
      );
    }
  } else {
    employeePayrollList = [createEmployeePayrollData()];
  }
  localStorage.setItem(
    "EmployeePayrollList",
    JSON.stringify(employeePayrollList)
  );
};

const createEmployeePayrollData = (id) => {
  let employeePayrollData = new EmployeePayrollData();
  if (!id) employeePayrollData.id = createNewEmployeeId();
  else employeePayrollData.id = id;
  setEmployeePayrollData(employeePayrollData);
  return employeePayrollData;
};

const setEmployeePayrollData = (employeePayrollData) => {
  try {
    employeePayrollData.name = employeePayrollObj._name;
  } catch (e) {
    setTextValue(".text-error", e);
    throw e;
  }
  employeePayrollData.profilePic = employeePayrollObj._profilePic;
  employeePayrollData.gender = employeePayrollObj._gender;
  employeePayrollData.department = employeePayrollObj._department;
  employeePayrollData.salary = employeePayrollObj._salary;
  employeePayrollData.note = employeePayrollObj._note;
  try {
    employeePayrollData.startDate = new Date(
      Date.parse(employeePayrollObj._startDate)
    );
  } catch (e) {
    setTextValue(".date-error", e);
    throw e;
  }
};

const createNewEmployeeId = () => {
  let empId = localStorage.getItem("EmployeeId");
  empId = !empId ? 1 : (parseInt(empId) + 1).toString();
  localStorage.setItem("EmployeeId", empId);
  return empId;
};

const getSelectedValues = (propertyValue) => {
  let allItems = document.querySelectorAll(propertyValue);
  let selItems = [];
  allItems.forEach((item) => {
    if (item.checked) {
      selItems.push(item.value);
    }
  });
  return selItems;
};

const getInputValueById = (id) => {
  let value = document.querySelector(id).value;
  return value;
};

const getInputElementValue = (id) => {
  let value = document.getElementById(id).value;
  return value;
};

const setTextValue = (id, value) => {
  const element = document.querySelector(id);
  element.textContent = value;
};

const setValue = (id, value) => {
  const element = document.querySelector(id);
  element.value = value;
};

const setForm = () => {
  setValue("#name", employeePayrollObj._name);
  setSelectedValues("[name=profile]", employeePayrollObj._profilePic);
  setSelectedValues("[name=gender]", employeePayrollObj._gender);
  setSelectedValues("[name=department]", employeePayrollObj._department);
  setValue("#salary", employeePayrollObj._salary);
  setTextValue(".salary-output", employeePayrollObj._salary);
  setValue("#notes", employeePayrollObj._note);
  let date = stringifyDate(employeePayrollObj._startDate).split(" ");
  setValue("#day", date[0]);
  setValue("#month", date[1]);
  setValue("#year", date[2]);
};

const setSelectedValues = (propertyValue, value) => {
  let allItems = document.querySelectorAll(propertyValue);
  allItems.forEach((item) => {
    if (Array.isArray(value)) {
      if (value.includes(item.value)) {
        item.checked = true;
      }
    } else if (item.value === value) {
      item.checked = true;
    }
  });
};

const resetForm = () => {
  const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach((item) => {
      item.checked = false;
    });
  };

  const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
  };

  const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.selectedIndex = index;
  };

  setValue("#name", "");
  unsetSelectedValues("[name=profile]");
  unsetSelectedValues("[name=gender]");
  unsetSelectedValues("[name=department]");
  setValue("#salary", "");
  setValue("#notes", "");
  setSelectedIndex("#day", 0);
  setSelectedIndex("#month", 0);
  setSelectedIndex("#year", 0);
};

const checkForUpdate = () => {
  const employeePayrollJson = localStorage.getItem("editEmp");
  isUpdate = employeePayrollJson ? true : false;

  if (!isUpdate) return;

  employeePayrollObj = JSON.parse(employeePayrollJson);
  setForm();
};

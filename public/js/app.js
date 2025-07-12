let employees = [];
let filteredEmployees = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentEditingId = null;
let currentFilters = {
    search: '',
    department: '',
    role: ''
};
let currentSort = {
    key: '',
    direction: 'asc'
};


let elements = {};

function initializeApp() {
    employees = [...mockEmployees];
    filteredEmployees = [...employees];
    
    cacheElements();
    
    setupEventListeners();
    
    renderEmployeeList();
    updatePagination();
    
    console.log('Employee Directory initialized successfully');
}

function cacheElements() {
    elements = {
        dashboardView: document.getElementById('dashboardView'),
        formView: document.getElementById('formView'),
        
        employeeList: document.getElementById('employeeList'),
        
        searchInput: document.getElementById('searchInput'),
        filterBtn: document.getElementById('filterBtn'),
        sortSelect: document.getElementById('sortSelect'),
        
        filterPanel: document.getElementById('filterPanel'),
        filterDepartment: document.getElementById('filterDepartment'),
        filterRole: document.getElementById('filterRole'),
        applyFilterBtn: document.getElementById('applyFilterBtn'),
        clearFilterBtn: document.getElementById('clearFilterBtn'),
        
        // Form elements
        employeeForm: document.getElementById('employeeForm'),
        formTitle: document.getElementById('formTitle'),
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email'),
        department: document.getElementById('department'),
        role: document.getElementById('role'),
        
        // buttons
        addEmployeeBtn: document.getElementById('addEmployeeBtn'),
        saveBtn: document.getElementById('saveBtn'),
        cancelBtn: document.getElementById('cancelBtn'),
        
        // Pagination
        paginationInfo: document.getElementById('paginationInfo'),
        paginationPages: document.getElementById('paginationPages'),
        prevPageBtn: document.getElementById('prevPageBtn'),
        nextPageBtn: document.getElementById('nextPageBtn'),
        itemsPerPageSelect: document.getElementById('itemsPerPageSelect'),
        
        // Error elements
        firstNameError: document.getElementById('firstNameError'),
        lastNameError: document.getElementById('lastNameError'),
        emailError: document.getElementById('emailError'),
        departmentError: document.getElementById('departmentError'),
        roleError: document.getElementById('roleError')
    };
}


 // Set up all event listeners
function setupEventListeners() {
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));

    elements.filterBtn.addEventListener('click', toggleFilterPanel);
    elements.applyFilterBtn.addEventListener('click', applyFilters);
    elements.clearFilterBtn.addEventListener('click', clearFilters);
    
    elements.sortSelect.addEventListener('change', handleSort);
    
    elements.addEmployeeBtn.addEventListener('click', showAddForm);
    elements.employeeForm.addEventListener('submit', handleFormSubmit);
    elements.cancelBtn.addEventListener('click', hideForm);
    
    // Pagination
    elements.prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    elements.nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));
    elements.itemsPerPageSelect.addEventListener('change', handleItemsPerPageChange);
   
    document.addEventListener('click', (e) => {
        if (!elements.filterPanel.contains(e.target) && !elements.filterBtn.contains(e.target)) {
            elements.filterPanel.classList.add('filter-panel--hidden');
        }
    });
}

function handleSearch(e) {
    currentFilters.search = e.target.value;
    applyAllFilters();
}

function toggleFilterPanel() {
    elements.filterPanel.classList.toggle('filter-panel--hidden');
}

function applyFilters() {
    currentFilters.department = elements.filterDepartment.value;
    currentFilters.role = elements.filterRole.value;
    
    applyAllFilters();
    elements.filterPanel.classList.add('filter-panel--hidden');
}

function clearFilters() {
    currentFilters = {
        search: '',
        department: '',
        role: ''
    };
    
    elements.searchInput.value = '';
    elements.filterDepartment.value = '';
    elements.filterRole.value = '';
    
    applyAllFilters();
    elements.filterPanel.classList.add('filter-panel--hidden');
}

function applyAllFilters() {
    let filtered = [...employees];
    
    // search filter
    if (currentFilters.search) {
        filtered = filterEmployeesBySearch(filtered, currentFilters.search);
    }
    
    //field filters
    filtered = filterEmployeesByFields(filtered, currentFilters.department, currentFilters.role);
    
    if (currentSort.key) {
        filtered = sortArrayByKey(filtered, currentSort.key, currentSort.direction);
    }
    
    filteredEmployees = filtered;
    currentPage = 1;
    renderEmployeeList();
    updatePagination();
}

function handleSort(e) {
    const sortValue = e.target.value;
    
    if (sortValue) {
        currentSort.key = sortValue;
        currentSort.direction = 'asc';
    } else {
        currentSort.key = '';
        currentSort.direction = 'asc';
    }
    
    applyAllFilters();
}

function renderEmployeeList() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const employeesToShow = filteredEmployees.slice(startIndex, endIndex);
    
    if (employeesToShow.length === 0) {
        elements.employeeList.innerHTML = `
            <div class="no-employees">
                <p>No employees found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    elements.employeeList.innerHTML = employeesToShow.map(employee => `
        <div class="employee-card">
            <div class="employee-card__header">
                <div class="employee-card__name">${formatFullName(employee.firstName, employee.lastName)}</div>
                <div class="employee-card__id">ID: ${employee.id}</div>
            </div>
            <div class="employee-card__body">
                <div class="employee-card__info">
                    <div class="employee-card__info-item">
                        <span class="employee-card__info-label">Email:</span>
                        <span class="employee-card__info-value">${employee.email}</span>
                    </div>
                    <div class="employee-card__info-item">
                        <span class="employee-card__info-label">Department:</span>
                        <span class="employee-card__info-value">${employee.department}</span>
                    </div>
                    <div class="employee-card__info-item">
                        <span class="employee-card__info-label">Role:</span>
                        <span class="employee-card__info-value">${employee.role}</span>
                    </div>
                </div>
                <div class="employee-card__actions">
                    <button class="btn btn--secondary" onclick="editEmployee(${employee.id})">
                        <span class="btn__icon">✏️</span>
                        Edit
                    </button>
                    <button class="btn btn--danger" onclick="deleteEmployee(${employee.id})">
                        <span class="btn__icon">🗑️</span>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function showAddForm() {
    currentEditingId = null;
    elements.formTitle.textContent = 'Add Employee';
    elements.saveBtn.textContent = 'Save Employee';
    
    clearForm();
    clearFormErrors();
    
    elements.dashboardView.style.display = 'none';
    elements.formView.classList.remove('form-view--hidden');
    elements.formView.style.display = 'block';
}


function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        alert('Employee not found');
        return;
    }
    
    currentEditingId = id;
    elements.formTitle.textContent = 'Edit Employee';
    elements.saveBtn.textContent = 'Update Employee';
    
    //form
    elements.firstName.value = employee.firstName;
    elements.lastName.value = employee.lastName;
    elements.email.value = employee.email;
    elements.department.value = employee.department;
    elements.role.value = employee.role;
    
    clearFormErrors();
    
    elements.dashboardView.style.display = 'none';
    elements.formView.classList.remove('form-view--hidden');
    elements.formView.style.display = 'block';
}

function deleteEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        showToast('Employee not found', 'error');
        return;
    }
    
    const confirmDelete = confirm(`Are you sure you want to delete ${formatFullName(employee.firstName, employee.lastName)}?`);
    
    if (confirmDelete) {
        employees = employees.filter(emp => emp.id !== id);
        applyAllFilters();
        showToast('Employee deleted successfully', 'success');
    }
}

function hideForm() {
    elements.formView.classList.add('form-view--hidden');
    elements.formView.style.display = 'none';
    elements.dashboardView.style.display = 'block';
    clearForm();
    clearFormErrors();
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        firstName: elements.firstName.value.trim(),
        lastName: elements.lastName.value.trim(),
        email: elements.email.value.trim(),
        department: elements.department.value,
        role: elements.role.value
    };
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    showLoading();
    
    // API call delay
    setTimeout(() => {
        if (currentEditingId) {
            const index = employees.findIndex(emp => emp.id === currentEditingId);
            if (index !== -1) {
                employees[index] = { ...employees[index], ...formData };
                alert('Employee updated successfully');
            }
        } else {
            // Add new employee
            const newEmployee = {
                id: Math.max(...employees.map(emp => emp.id), 0) + 1,
                ...formData
            };
            employees.push(newEmployee);
            alert('Employee added successfully');
        }
        
        hideLoading();
        applyAllFilters();
        hideForm();
    }, 500);
}

function validateForm(formData) {
    let isValid = true;
    clearFormErrors();
    
    // name validation
    if (!validateRequired(formData.firstName)) {
        showFieldError('firstName', 'First name is required');
        isValid = false;
    }
    
    // Last name 
    if (!validateRequired(formData.lastName)) {
        showFieldError('lastName', 'Last name is required');
        isValid = false;
    }
    
    // Email
    if (!validateRequired(formData.email)) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(formData.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        const existingEmployee = employees.find(emp => 
            emp.email.toLowerCase() === formData.email.toLowerCase() && 
            emp.id !== currentEditingId
        );
        if (existingEmployee) {
            showFieldError('email', 'This email is already in use');
            isValid = false;
        }
    }

    if (!validateRequired(formData.department)) {
        showFieldError('department', 'Department is required');
        isValid = false;
    }
    
    if (!validateRequired(formData.role)) {
        showFieldError('role', 'Role is required');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldName, message) {
    const errorElement = elements[`${fieldName}Error`];
    const inputElement = elements[fieldName];
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    if (inputElement) {
        inputElement.classList.add('form-group__input--error');
    }
}

function clearFormErrors() {
    const errorFields = ['firstName', 'lastName', 'email', 'department', 'role'];
    
    errorFields.forEach(field => {
        const errorElement = elements[`${field}Error`];
        const inputElement = elements[field];
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        if (inputElement) {
            inputElement.classList.remove('form-group__input--error');
        }
    });
}

function clearForm() {
    elements.firstName.value = '';
    elements.lastName.value = '';
    elements.email.value = '';
    elements.department.value = '';
    elements.role.value = '';
}

function handleItemsPerPageChange(e) {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    renderEmployeeList();
    updatePagination();
}
function changePage(page) {
    const maxPage = Math.ceil(filteredEmployees.length / itemsPerPage);
    
    if (page < 1 || page > maxPage) {
        return;
    }
    
    currentPage = page;
    renderEmployeeList();
    updatePagination();
}

function updatePagination() {
    const totalItems = filteredEmployees.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    elements.paginationInfo.textContent = 
        `Showing ${startItem}-${endItem} of ${totalItems} employees`;
    
    elements.prevPageBtn.disabled = currentPage === 1;
    elements.nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    generatePageNumbers(totalPages);
}

function generatePageNumbers(totalPages) {
    let pageNumbers = '';
    
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers += createPageButton(i);
        }
    } else {
        pageNumbers += createPageButton(1);
        
        if (currentPage > 3) {
            pageNumbers += '<span class="pagination__ellipsis">...</span>';
        }
        
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        
        for (let i = start; i <= end; i++) {
            pageNumbers += createPageButton(i);
        }
        
        if (currentPage < totalPages - 2) {
            pageNumbers += '<span class="pagination__ellipsis">...</span>';
        }
        
        pageNumbers += createPageButton(totalPages);
    }
    
    elements.paginationPages.innerHTML = pageNumbers;
}

function createPageButton(page) {
    const isActive = page === currentPage ? 'pagination__page--active' : '';
    return `
        <button class="pagination__page ${isActive}" onclick="changePage(${page})">
            ${page}
        </button>
    `;
}


document.addEventListener('DOMContentLoaded', initializeApp);

window.editEmployee = editEmployee;
window.deleteEmployee = deleteEmployee;
window.changePage = changePage;
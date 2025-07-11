/**
 * Utility Functions
 * This file contains helper functions used throughout the application
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(email) {
    return EMAIL_REGEX.test(email);
}

/**
 * Validates if a string is not empty after trimming
 * @param {string} value - The value to validate
 * @returns {boolean} - True if not empty, false otherwise
 */
function validateRequired(value) {
    return value && value.trim().length > 0;
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Generates a unique ID (simple implementation)
 * @returns {number} - A unique ID
 */
function generateUniqueId() {
    return Date.now() + Math.random();
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formats a name for display
 * @param {string} firstName - The first name
 * @param {string} lastName - The last name
 * @returns {string} - The formatted full name
 */
function formatFullName(firstName, lastName) {
    return `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`;
}

/**
 * Sorts an array of objects by a specified key
 * @param {Array} array - The array to sort
 * @param {string} key - The key to sort by
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Array} - The sorted array
 */
function sortArrayByKey(array, key, direction = 'asc') {
    return array.sort((a, b) => {
        const aValue = a[key] ? a[key].toString().toLowerCase() : '';
        const bValue = b[key] ? b[key].toString().toLowerCase() : '';
        
        if (direction === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });
}

/**
 * Filters an array of employees based on search criteria
 * @param {Array} employees - The array of employees
 * @param {string} searchTerm - The search term
 * @returns {Array} - The filtered array
 */
function filterEmployeesBySearch(employees, searchTerm) {
    if (!searchTerm) return employees;
    
    const term = searchTerm.toLowerCase();
    return employees.filter(employee => 
        employee.firstName.toLowerCase().includes(term) ||
        employee.lastName.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.department.toLowerCase().includes(term) ||
        employee.role.toLowerCase().includes(term)
    );
}

/**
 * Filters an array of employees based on department and role
 * @param {Array} employees - The array of employees
 * @param {string} department - The department filter
 * @param {string} role - The role filter
 * @returns {Array} - The filtered array
 */
function filterEmployeesByFields(employees, department, role) {
    return employees.filter(employee => {
        const matchesDepartment = !department || employee.department === department;
        const matchesRole = !role || employee.role === role;
        return matchesDepartment && matchesRole;
    });
}

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('loading-overlay--hidden');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('loading-overlay--hidden');
    }
}

function showToast(message, type = 'info') {
    alert(message);
}
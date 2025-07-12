/**
 * Employee Directory Management System
 * A comprehensive solution for managing employee data with CRUD operations,
 * search, filter, sort, and pagination functionality.
 */

// Employee data management
let employees = [
    {
        id: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        department: 'HR',
        role: 'Manager'
    },
    {
        id: 2,
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        department: 'IT',
        role: 'Developer'
    },
    {
        id: 3,
        firstName: 'Charlie',
        lastName: 'Lee',
        email: 'charlie@example.com',
        department: 'Finance',
        role: 'Analyst'
    },
    {
        id: 4,
        firstName: 'Diana',
        lastName: 'Brown',
        email: 'diana@example.com',
        department: 'Marketing',
        role: 'Coordinator'
    },
    {
        id: 5,
        firstName: 'Edward',
        lastName: 'Wilson',
        email: 'edward@example.com',
        department: 'IT',
        role: 'Senior Developer'
    },
    {
        id: 6,
        firstName: 'Fiona',
        lastName: 'Davis',
        email: 'fiona@example.com',
        department: 'HR',
        role: 'Recruiter'
    },
    {
        id: 7,
        firstName: 'George',
        lastName: 'Miller',
        email: 'george@example.com',
        department: 'Finance',
        role: 'Accountant'
    },
    {
        id: 8,
        firstName: 'Hannah',
        lastName: 'Garcia',
        email: 'hannah@example.com',
        department: 'Marketing',
        role: 'Manager'
    },
    {
        id: 9,
        firstName: 'Ian',
        lastName: 'Martinez',
        email: 'ian@example.com',
        department: 'IT',
        role: 'DevOps Engineer'
    },
    {
        id: 10,
        firstName: 'Julia',
        lastName: 'Anderson',
        email: 'julia@example.com',
        department: 'HR',
        role: 'Specialist'
    }
];

// Application state
let currentPage = 1;
let employeesPerPage = 10;
let filteredEmployees = [...employees];
let searchTerm = '';
let sortOption = '';
let filterOptions = {
    firstName: '',
    department: '',
    role: ''
};
let editingEmployeeId = null;
let deleteEmployeeId = null;

// DOM elements
const employeeGrid = document.getElementById('employeeGrid');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const showSelect = document.getElementById('showSelect');
const filterBtn = document.getElementById('filterBtn');
const filterSidebar = document.getElementById('filterSidebar');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const employeeModal = document.getElementById('employeeModal');
const deleteModal = document.getElementById('deleteModal');
const employeeForm = document.getElementById('employeeForm');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    renderEmployees();
    renderPagination();
});

/**
 * Setup all event listeners for the application
 */
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Sort functionality
    sortSelect.addEventListener('change', handleSort);
    
    // Show/pagination functionality
    showSelect.addEventListener('change', handleShowChange);
    
    // Filter functionality
    filterBtn.addEventListener('click', toggleFilterSidebar);
    document.getElementById('applyFilterBtn').addEventListener('click', applyFilters);
    document.getElementById('resetFilterBtn').addEventListener('click', resetFilters);
    
    // Add employee functionality
    addEmployeeBtn.addEventListener('click', openAddEmployeeModal);
    
    // Modal functionality
    document.getElementById('cancelBtn').addEventListener('click', closeEmployeeModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Form submission
    employeeForm.addEventListener('submit', handleFormSubmit);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === employeeModal) {
            closeEmployeeModal();
        }
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    });
    
    // Close filter sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (!filterSidebar.contains(event.target) && !filterBtn.contains(event.target)) {
            closeFilterSidebar();
        }
    });
}

/**
 * Handle search functionality
 */
function handleSearch(event) {
    searchTerm = event.target.value.toLowerCase();
    currentPage = 1;
    applyFiltersAndSearch();
}

/**
 * Handle sort functionality
 */
function handleSort(event) {
    sortOption = event.target.value;
    applyFiltersAndSearch();
}

/**
 * Handle show/pagination change
 */
function handleShowChange(event) {
    employeesPerPage = parseInt(event.target.value);
    currentPage = 1;
    renderEmployees();
    renderPagination();
}

/**
 * Apply filters and search to employee data
 */
function applyFiltersAndSearch() {
    let filtered = employees.filter(employee => {
        // Apply search filter
        const matchesSearch = searchTerm === '' || 
            employee.firstName.toLowerCase().includes(searchTerm) ||
            employee.lastName.toLowerCase().includes(searchTerm) ||
            employee.email.toLowerCase().includes(searchTerm);
        
        // Apply field filters
        const matchesFirstName = filterOptions.firstName === '' || 
            employee.firstName.toLowerCase().includes(filterOptions.firstName.toLowerCase());
        const matchesDepartment = filterOptions.department === '' || 
            employee.department.toLowerCase().includes(filterOptions.department.toLowerCase());
        const matchesRole = filterOptions.role === '' || 
            employee.role.toLowerCase().includes(filterOptions.role.toLowerCase());
        
        return matchesSearch && matchesFirstName && matchesDepartment && matchesRole;
    });
    
    // Apply sorting
    if (sortOption) {
        const [field, direction] = sortOption.split('-');
        filtered.sort((a, b) => {
            let aValue = a[field].toLowerCase();
            let bValue = b[field].toLowerCase();
            
            if (direction === 'desc') {
                return bValue.localeCompare(aValue);
            }
            return aValue.localeCompare(bValue);
        });
    }
    
    filteredEmployees = filtered;
    renderEmployees();
    renderPagination();
}

/**
 * Toggle filter sidebar
 */
function toggleFilterSidebar() {
    filterSidebar.classList.toggle('open');
}

/**
 * Close filter sidebar
 */
function closeFilterSidebar() {
    filterSidebar.classList.remove('open');
}

/**
 * Apply filters from sidebar
 */
function applyFilters() {
    filterOptions.firstName = document.getElementById('filterFirstName').value;
    filterOptions.department = document.getElementById('filterDepartment').value;
    filterOptions.role = document.getElementById('filterRole').value;
    
    currentPage = 1;
    applyFiltersAndSearch();
    closeFilterSidebar();
}

/**
 * Reset all filters
 */
function resetFilters() {
    document.getElementById('filterFirstName').value = '';
    document.getElementById('filterDepartment').value = '';
    document.getElementById('filterRole').value = '';
    
    filterOptions = {
        firstName: '',
        department: '',
        role: ''
    };
    
    currentPage = 1;
    applyFiltersAndSearch();
}

/**
 * Render employees grid
 */
function renderEmployees() {
    const startIndex = (currentPage - 1) * employeesPerPage;
    const endIndex = startIndex + employeesPerPage;
    const employeesToShow = filteredEmployees.slice(startIndex, endIndex);
    
    if (employeesToShow.length === 0) {
        employeeGrid.innerHTML = `
            <div class="empty-state">
                <h3>No employees found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }
    
    employeeGrid.innerHTML = employeesToShow.map(employee => `
        <div class="employee-card">
            <div class="employee-name"><h4>${employee.firstName} ${employee.lastName}</h4></div>
            <div class="employee-info">
                <p><strong>Email:</strong> ${employee.email}</p>
                <p><strong>Department:</strong> ${employee.department}</p>
                <p><strong>Role:</strong> ${employee.role}</p>
            </div>
            <div class="employee-actions">
                <button class="edit-btn" onclick="openEditEmployeeModal(${employee.id})">Edit</button>
                <button class="delete-btn" onclick="openDeleteModal(${employee.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

/**
 * Render pagination controls
 */
function renderPagination() {
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            Previous
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += `<span class="pagination-btn" disabled>...</span>`;
        }
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Next
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

/**
 * Change current page
 */
function changePage(page) {
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderEmployees();
        renderPagination();
    }
}

/**
 * Open add employee modal
 */
function openAddEmployeeModal() {
    editingEmployeeId = null;
    modalTitle.textContent = 'Add Employee';
    submitBtn.textContent = 'Add';
    resetForm();
    employeeModal.classList.add('show');
}

/**
 * Open edit employee modal
 */
function openEditEmployeeModal(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    
    editingEmployeeId = id;
    modalTitle.textContent = 'Edit Employee';
    submitBtn.textContent = 'Update';
    
    // Populate form with employee data
    document.getElementById('firstName').value = employee.firstName;
    document.getElementById('lastName').value = employee.lastName;
    document.getElementById('email').value = employee.email;
    document.getElementById('department').value = employee.department;
    document.getElementById('role').value = employee.role;
    
    employeeModal.classList.add('show');
}

/**
 * Close employee modal
 */
function closeEmployeeModal() {
    employeeModal.classList.remove('show');
    resetForm();
}

/**
 * Open delete confirmation modal
 */
function openDeleteModal(id) {
    deleteEmployeeId = id;
    deleteModal.classList.add('show');
}

/**
 * Close delete confirmation modal
 */
function closeDeleteModal() {
    deleteModal.classList.remove('show');
    deleteEmployeeId = null;
}

/**
 * Confirm delete employee
 */
function confirmDelete() {
    if (deleteEmployeeId) {
        deleteEmployee(deleteEmployeeId);
        closeDeleteModal();
    }
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (validateForm()) {
        const formData = new FormData(employeeForm);
        const employeeData = {
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            email: formData.get('email').trim(),
            department: formData.get('department'),
            role: formData.get('role')
        };
        
        if (editingEmployeeId) {
            updateEmployee(editingEmployeeId, employeeData);
        } else {
            addEmployee(employeeData);
        }
        
        closeEmployeeModal();
    }
}

/**
 * Validate form data
 */
function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
    
    // Validate first name
    const firstName = document.getElementById('firstName').value.trim();
    if (!firstName) {
        showError('firstNameError', 'First name is required');
        isValid = false;
    } else if (firstName.length < 2) {
        showError('firstNameError', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate last name
    const lastName = document.getElementById('lastName').value.trim();
    if (!lastName) {
        showError('lastNameError', 'Last name is required');
        isValid = false;
    } else if (lastName.length < 2) {
        showError('lastNameError', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    } else if (isEmailDuplicate(email)) {
        showError('emailError', 'This email is already in use');
        isValid = false;
    }
    
    // Validate department
    const department = document.getElementById('department').value;
    if (!department) {
        showError('departmentError', 'Department is required');
        isValid = false;
    }
    
    // Validate role
    const role = document.getElementById('role').value;
    if (!role) {
        showError('roleError', 'Role is required');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Check if email is duplicate
 */
function isEmailDuplicate(email) {
    return employees.some(emp => 
        emp.email.toLowerCase() === email.toLowerCase() && 
        emp.id !== editingEmployeeId
    );
}

/**
 * Show validation error
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

/**
 * Reset form
 */
function resetForm() {
    employeeForm.reset();
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
}

/**
 * Add new employee
 */
function addEmployee(employeeData) {
    const newEmployee = {
        id: Date.now(), // Simple ID generation
        ...employeeData
    };
    
    employees.push(newEmployee);
    applyFiltersAndSearch();
    
    // Show success message (optional)
    showNotification('Employee added successfully!', 'success');
}

/**
 * Update existing employee
 */
function updateEmployee(id, employeeData) {
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        employees[index] = { ...employees[index], ...employeeData };
        applyFiltersAndSearch();
        
        // Show success message (optional)
        showNotification('Employee updated successfully!', 'success');
    }
}

/**
 * Delete employee
 */
function deleteEmployee(id) {
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        employees.splice(index, 1);
        applyFiltersAndSearch();
        
        // Show success message (optional)
        showNotification('Employee deleted successfully!', 'success');
    }
}

/**
 * Show notification (optional feature)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#48bb78' : '#3182ce'};
        color: white;
        border-radius: 4px;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        validateForm,
        applyFiltersAndSearch
    };
}
const galleryImages = [
    "larawan1.jpg",
    "larawan2.jpg",
    "larawan4jpg.jpg"
];

let currentIndex = 0;

function updateCarousel() {
    const carouselImage = document.querySelector('#carouselImage');
    if (carouselImage && galleryImages.length > 0) {
        carouselImage.src = galleryImages[currentIndex];
    }
}

function navigate(direction) {
    if (direction === 'next') {
        if (currentIndex < galleryImages.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
    } else if (direction === 'prev') {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = galleryImages.length - 1;
        }
    }
    updateCarousel();
}


let courseData = [
    { id: "CS101", name: "Computer Science", category: "Major", status: "Enrolled", units: 4 },
    { id: "MATH201", name: "Database Systems", category: "Major", status: "Enrolled", units: 4 },
    { id: "ENG101", name: " Life and Works of Jose Rizal", category: "GE", status: "Enrolled", units: 2 },
    { id: "HIST102", name: "Physical Education (PathFit)", category: "GE", status: "Enrolled", units: 3 },
    { id: "ART105", name: "Multimedia and Digital Arts", category: "Elective", status: "Enrolled", units: 2 }
];

let activeCategory = "All";

// DOM References
let cardsContainer, detailsTableBody, navCourseCount, totalUnitsMetric, activeCoursesMetric, addCourseForm;


// --- INITIAL SETUP ON PAGE LOAD ---
document.addEventListener("DOMContentLoaded", () => {
    // Bind DOM elements
    cardsContainer = document.getElementById("course-cards-container");
    detailsTableBody = document.getElementById("details-table-body");
    navCourseCount = document.getElementById("nav-course-count");
    totalUnitsMetric = document.getElementById("metric-total-units");
    activeCoursesMetric = document.getElementById("metric-active-courses");
    addCourseForm = document.getElementById("addCourseForm");

    // Carousel buttons
    const prevBtn = document.querySelector('#prevBtn');
    const nextBtn = document.querySelector('#nextBtn');

    if (prevBtn) prevBtn.addEventListener('click', () => navigate('prev'));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate('next'));

    updateCarousel();
    renderAll();
});

function switchView(viewName) {
    const sections = document.querySelectorAll(".view-section");
    sections.forEach(sec => sec.classList.add("d-none"));

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => link.classList.remove("active"));

    const targetSection = document.getElementById(`view-${viewName}`);
    const targetNavLink = document.getElementById(`nav-${viewName}`);

    if (targetSection) targetSection.classList.remove("d-none");
    if (targetNavLink) targetNavLink.classList.add("active");
}


// --- HELPER FUNCTIONS ---
function getBadgeClass(status) {
    switch (status) {
        case "Enrolled": return "bg-success";
        case "Completed": return "bg-info text-dark";
        case "Pending": return "bg-warning text-dark";
        default: return "bg-secondary";
    }
}


// --- DYNAMIC RENDERING ---
function renderAll() {
    renderCards();
    renderDetailsTable();
    updateMetrics();
}

function renderCards() {
    if (!cardsContainer) return;
    cardsContainer.innerHTML = "";

    const filteredCourses = activeCategory === "All" 
        ? courseData 
        : courseData.filter(c => c.category === activeCategory);

    if (filteredCourses.length === 0) {
        cardsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted fs-5">No courses found under this category.</p>
            </div>`;
        return;
    }

    filteredCourses.forEach(course => {
        const cardCol = document.createElement("div");
        cardCol.className = "col-12 col-md-6 col-lg-4";

        cardCol.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-light text-dark border fw-semibold">${course.id}</span>
                        <span class="badge ${getBadgeClass(course.status)}">${course.status}</span>
                    </div>
                    <h5 class="card-title fw-bold text-dark mb-2">${course.name}</h5>
                    <p class="text-muted small mb-3">
                        <i class="bi bi-tag-fill me-1 text-success"></i> Category: ${course.category}
                    </p>
                    <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                        <span class="fw-bold text-success"><i class="bi bi-journal-text me-1"></i>${course.units} Units</span>
                    </div>
                </div>
            </div>
        `;
        cardsContainer.appendChild(cardCol);
    });
}

function renderDetailsTable() {
    if (!detailsTableBody) return;
    detailsTableBody.innerHTML = "";

    courseData.forEach(course => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="fw-bold">${course.id}</td>
            <td>${course.name}</td>
            <td><span class="badge bg-light text-dark border">${course.category}</span></td>
            <td class="fw-bold text-success">${course.units}</td>
            <td><span class="badge ${getBadgeClass(course.status)}">${course.status}</span></td>
        `;
        detailsTableBody.appendChild(row);
    });
}

function updateMetrics() {
    if (!navCourseCount) return;

    const enrolledCourses = courseData.filter(c => c.status === "Enrolled");
    navCourseCount.textContent = enrolledCourses.length;

    const totalUnits = courseData.reduce((acc, c) => acc + Number(c.units), 0);
    totalUnitsMetric.textContent = totalUnits;

    activeCoursesMetric.textContent = courseData.filter(c => c.status !== "Completed").length;
}

function filterCategory(category, element) {
    activeCategory = category;

    // Remove active class from all filter buttons in the group
    const filterBtns = element.parentElement.querySelectorAll(".btn");
    filterBtns.forEach(btn => btn.classList.remove("active"));

    // Add active class to clicked button
    element.classList.add("active");

    // Re-render the course cards with the filtered category
    renderCards();
}

function handleAddCourse(event) {
    event.preventDefault();

    const newCourse = {
        id: document.getElementById("courseCode").value.trim().toUpperCase(),
        name: document.getElementById("courseName").value.trim(),
        category: document.getElementById("courseCategory").value,
        units: Number(document.getElementById("courseUnits").value),
        status: document.getElementById("courseStatus").value
    };

    courseData.push(newCourse);
    renderAll();

    // Reset and close modal
    addCourseForm.reset();
    const modalElement = document.getElementById("addCourseModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
}

const midtermInput = document.getElementById("midterm-input");
const finalInput = document.getElementById("final-input");
const computeBtn = document.getElementById("compute-btn");
const outputMatrix = document.getElementById("output-matrix");

function calculateGradePayload() {
    
    const trimmedInputMidterm = midtermInput.value.trim();
     const trimmedInputFinal = finalInput.value.trim();

    let midtermScore = Number(trimmedInputMidterm);
    let finalScore = Number(trimmedInputFinal);

    let computedScore = (midtermScore * 0.45) + (finalScore * 0.55);
    console.log(computedScore);

    if (trimmedInputMidterm === "" && trimmedInputFinal === "") {
        outputMatrix.innerHTML = "<strong class='text-danger'><h1>INVALID!</h1> Please enter a valid Final Grade and Midterm Grade before submitting..</strong>";
        return;

    } else if (trimmedInputMidterm === "") {
        outputMatrix.innerHTML = "<strong class='text-danger'><h1>INVALID!</h1>  Please don't put an empty input on the midterm grade.</strong>";
        return;

    } else if (trimmedInputFinal === "") {
        outputMatrix.innerHTML = "<strong class='text-danger'><h1>INVALID!</h1>  Please don't put an empty input on the final grade.</strong>";
        return;

    } else if (isNaN(trimmedInputMidterm) && isNaN(trimmedInputFinal)) {
        outputMatrix.innerHTML = "<strong class='text-danger'><h1>INVALID!</h1>  Please enter a valid input score. </strong>";
        return;

    } else if (isNaN(trimmedInputMidterm)) {
        outputMatrix.innerHTML = "<strong class='text-danger'><h1>INVALID!</h1>  Please enter a valid input score on the midterm grade.</strong>";
        return;

    } else if (isNaN(trimmedInputFinal)) {
        outputMatrix.innerHTML = "<strong class='text-danger'><h1>INVALID!</h1> Please enter a valid input score on the final grade.</strong>";
        return;

    } else if (computedScore < 0) {
        outputMatrix.innerHTML = "<strong class='text-danger'><h1>INVALID!</h1>  Score must be between 0 and 100.</strong>";
        return;

    } else if (computedScore > 100) {
        outputMatrix.innerHTML = "<strong class='text-danger'><h1>INVALID!</h1>  Score must be between 0 and 100.</strong>"; 
        return;
    }
    
    let statustext = "";
    let statusColorClass = "";

    if (computedScore === 100) {
        statustext = "1.00";
        statusColorClass = "text-success";

    } else if (computedScore <= 74) {
        statustext = "5.00";
        statusColorClass = "text-danger";

    } else if (computedScore >= 96) {
        statustext = "1.25";
        statusColorClass = "text-success";

    } else if (computedScore >= 90) {
        statustext = "1.75";
        statusColorClass = "text-success";

    }  else if (computedScore >= 86) {
        statustext = "2.00";
        statusColorClass = "text-success";
        
    } else if (computedScore >= 81) {
        statustext = "2.50";
        statusColorClass = "text-success";
    

    } else if (computedScore >= 75) {
        statustext = "3.00";
        statusColorClass = "text-success";
    }        

    else {
        statustext = "Failed";
        statusColorClass = "text-danger";
    }

    outputMatrix.innerHTML =
     "<h4>Final Score: " + computedScore + "%" + "</h4>" + 
    "<h1 class='display-4 " + statusColorClass + " fw-bold'>" + statustext + "</h1>";
} 

    computeBtn.addEventListener("click", calculateGradePayload);

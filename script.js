// Configuration object for the dashboard
const dashboardConfig = {
    statistics: {
        aircraftCount: 247,
        personnelCount: 5326,
        yearsService: 74
    },
    announcements: [
        {date: "2023-10-15", text: "Scheduled maintenance completed on fleet sector C. All aircraft operational."},
        {date: "2023-10-14", text: "New personnel training program launched. Next session begins November 1."},
        {date: "2023-10-13", text: "Mission Alpha successful. All units returned safely ahead of schedule."},
        {date: "2023-10-12", text: "System upgrade scheduled for 0200-0400 UTC. Minimal disruption expected."},
        {date: "2023-10-11", text: "Weather advisory: Sector D may experience turbulence. Alternate routes activated."},
        {date: "2023-10-10", text: "Quarterly readiness assessment shows 98.7% operational readiness across all units."},
        {date: "2023-10-09", text: "New communication protocol implemented across all command channels."}
    ],
    animationDurations: {
        aircraftCount: 2000,
        personnelCount: 2500,
        yearsService: 1500
    }
};

// Animated statistics counters
function animateCounter(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTime = null;
    
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        // Format numbers with commas
        obj.textContent = value.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Initialize announcement ticker
function initAnnouncementTicker() {
    const tickerContent = document.getElementById('announcementTicker');
    
    // Clear existing content
    tickerContent.innerHTML = '';
    
    // Build announcement ticker items
    dashboardConfig.announcements.forEach(announcement => {
        const announcementElement = document.createElement('span');
        announcementElement.className = 'announcement-item';
        announcementElement.innerHTML = `<span class="announcement-date">${announcement.date}</span> ${announcement.text}`;
        tickerContent.appendChild(announcementElement);
    });
    
    // Duplicate announcements for seamless scrolling
    dashboardConfig.announcements.forEach(announcement => {
        const announcementElement = document.createElement('span');
        announcementElement.className = 'announcement-item';
        announcementElement.innerHTML = `<span class="announcement-date">${announcement.date}</span> ${announcement.text}`;
        tickerContent.appendChild(announcementElement);
    });
}

// Update current time display
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    document.getElementById('currentTime').textContent = `${dateString} ${timeString}`;
    
    // Calculate next refresh (every 30 seconds)
    const nextRefresh = new Date(now.getTime() + 30000);
    const refreshTimeString = nextRefresh.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit'
    });
    document.getElementById('nextRefresh').textContent = refreshTimeString;
}

// Add animation to carousel captions
function initCarouselAnimations() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;
    
    carousel.addEventListener('slide.bs.carousel', function() {
        const captions = document.querySelectorAll('.carousel-caption');
        captions.forEach(caption => {
            caption.classList.remove('fade-in-up');
            void caption.offsetWidth; // Trigger reflow
            caption.classList.add('fade-in-up');
        });
    });
}

// Initialize animated statistics
function initStatistics() {
    const stats = dashboardConfig.statistics;
    const durations = dashboardConfig.animationDurations;
    
    setTimeout(() => {
        animateCounter('aircraftCount', 0, stats.aircraftCount, durations.aircraftCount);
        animateCounter('personnelCount', 0, stats.personnelCount, durations.personnelCount);
        animateCounter('yearsService', 0, stats.yearsService, durations.yearsService);
    }, 500);
}

// Initialize the entire dashboard
function initDashboard() {
    // Initialize all components
    initAnnouncementTicker();
    initStatistics();
    initCarouselAnimations();
    
    // Update time immediately and set interval
    updateTime();
    setInterval(updateTime, 1000);
    
    // Add keyboard controls for the carousel
    document.addEventListener('keydown', function(event) {
        const carousel = document.getElementById('heroCarousel');
        if (!carousel) return;
        
        if (event.key === 'ArrowLeft') {
            const prevButton = carousel.querySelector('.carousel-control-prev');
            prevButton.click();
        } else if (event.key === 'ArrowRight') {
            const nextButton = carousel.querySelector('.carousel-control-next');
            nextButton.click();
        }
    });
    
    console.log('Dashboard initialized successfully');
}

// Initialize dashboard when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initDashboard);
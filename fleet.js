 // Simple demonstration functions (not required for basic functionality)
        function setCompareAircraft(aircraft1, aircraft2) {
            document.getElementById('compareAircraft1').textContent = aircraft1;
            document.getElementById('compareAircraft2').textContent = aircraft2;
            document.getElementById('compareHeader1').textContent = aircraft1;
            document.getElementById('compareHeader2').textContent = aircraft2;
        }
        
        function filterByStatus(status) {
            // This would filter aircraft in a real implementation
            console.log("Filtering by status: " + status);
        }
        
        function filterAircraft() {
            // This would filter aircraft in a real implementation
            console.log("Filtering aircraft");
        }
        
        function resetFilters() {
            document.getElementById('typeFilter').value = 'all';
            document.getElementById('statusFilter').value = 'all';
            document.getElementById('searchInput').value = '';
            document.getElementById('statusAll').checked = true;
            console.log("Filters reset");
        }
        
        // Set default comparison
        setCompareAircraft('F-22 Raptor', 'F-35 Lightning II');
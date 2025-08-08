# Start local HTTP server for website preview

Write-Host "Starting local HTTP server, please visit http://localhost:8000/HOTPRODUCTS.html in your browser"
Write-Host "Press Ctrl+C to stop the server"

# Start Python HTTP server
python -m http.server 8000